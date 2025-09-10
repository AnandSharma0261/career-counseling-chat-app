/**
 * Main tRPC API router
 * Combines all individual routers into a single app router
 */
import { createTRPCRouter } from '../../lib/trpc/trpc';
import { chatRouter } from './routers/chat';

/**
 * This is the primary router for the tRPC server
 * All routers added here are accessible to the client
 */
export const appRouter = createTRPCRouter({
  chat: chatRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
