/**
 * Chat router for handling all chat-related API operations
 * Includes session management, message handling, and AI integration
 */
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../../lib/trpc/trpc';
import { chatSessions, messages } from '../../../lib/db/schema';
import { generateCareerAdvice, generateSessionTitle } from '../../../lib/ai/career-counselor';
import { eq, desc } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { ensureDbInitialized } from '../../../lib/db';

export const chatRouter = createTRPCRouter({
  /**
   * Create a new chat session
   */
  createSession: publicProcedure
    .input(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        userId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Ensure database is initialized
        await ensureDbInitialized();
        
        const sessionData = {
          title: input.title || 'New Chat Session',
          description: input.description || null,
          userId: input.userId || null,
        };

        const [newSession] = await ctx.db
          .insert(chatSessions)
          .values(sessionData)
          .returning();

        return newSession;
      } catch (error) {
        console.error('Error creating chat session:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create chat session',
        });
      }
    }),

  /**
   * Get all chat sessions (with pagination)
   */
  getSessions: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        // Ensure database is initialized
        await ensureDbInitialized();
        
        const sessions = await ctx.db
          .select()
          .from(chatSessions)
          .where(input.userId ? eq(chatSessions.userId, input.userId) : undefined)
          .orderBy(desc(chatSessions.updatedAt))
          .limit(input.limit)
          .offset(input.offset);

        return sessions;
      } catch (error) {
        console.error('Error fetching chat sessions:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch chat sessions',
        });
      }
    }),

  /**
   * Get a specific chat session with its messages
   */
  getSession: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        // Get session details
        const [session] = await ctx.db
          .select()
          .from(chatSessions)
          .where(eq(chatSessions.id, input.sessionId));

        if (!session) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Chat session not found',
          });
        }

        // Get session messages
        const sessionMessages = await ctx.db
          .select()
          .from(messages)
          .where(eq(messages.sessionId, input.sessionId))
          .orderBy(messages.timestamp);

        return {
          session,
          messages: sessionMessages,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error fetching chat session:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch chat session',
        });
      }
    }),

  /**
   * Send a message and get AI response
   */
  sendMessage: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        content: z.string().min(1),
        isFirstMessage: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Ensure database is initialized
        await ensureDbInitialized();
        
        // Save user message
        const [userMessage] = await ctx.db
          .insert(messages)
          .values({
            sessionId: input.sessionId,
            content: input.content,
            role: 'user',
          })
          .returning();

        // Get conversation history for AI context
        const conversationHistory = await ctx.db
          .select()
          .from(messages)
          .where(eq(messages.sessionId, input.sessionId))
          .orderBy(messages.timestamp);

        // Prepare messages for AI
        const aiMessages = conversationHistory.map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        }));

        // Generate AI response
        const aiResponse = await generateCareerAdvice(aiMessages);

        // Save AI response
        const [assistantMessage] = await ctx.db
          .insert(messages)
          .values({
            sessionId: input.sessionId,
            content: aiResponse,
            role: 'assistant',
          })
          .returning();

        // If this is the first message, generate a session title
        if (input.isFirstMessage) {
          try {
            const title = await generateSessionTitle(input.content);
            await ctx.db
              .update(chatSessions)
              .set({ 
                title,
                updatedAt: new Date(),
              })
              .where(eq(chatSessions.id, input.sessionId));
          } catch (error) {
            console.error('Error updating session title:', error);
            // Don't fail the request if title generation fails
          }
        } else {
          // Update session timestamp
          await ctx.db
            .update(chatSessions)
            .set({ updatedAt: new Date() })
            .where(eq(chatSessions.id, input.sessionId));
        }

        return {
          userMessage,
          assistantMessage,
        };
      } catch (error) {
        console.error('Error sending message:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to send message',
        });
      }
    }),

  /**
   * Delete a chat session
   */
  deleteSession: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Ensure database is initialized
        await ensureDbInitialized();
        
        const deletedSessions = await ctx.db
          .delete(chatSessions)
          .where(eq(chatSessions.id, input.sessionId))
          .returning();

        if (deletedSessions.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Chat session not found',
          });
        }

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error deleting chat session:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete chat session',
        });
      }
    }),

  /**
   * Update session title
   */
  updateSessionTitle: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        title: z.string().min(1).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Ensure database is initialized
        await ensureDbInitialized();
        
        const [updatedSession] = await ctx.db
          .update(chatSessions)
          .set({ 
            title: input.title,
            updatedAt: new Date(),
          })
          .where(eq(chatSessions.id, input.sessionId))
          .returning();

        if (!updatedSession) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Chat session not found',
          });
        }

        return updatedSession;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error updating session title:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update session title',
        });
      }
    }),
});
