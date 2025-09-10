/**
 * tRPC configuration for the career counseling chat application
 * Sets up the main tRPC instance with context and error handling
 */
import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { db } from '../db';

/**
 * Context creation for tRPC
 * This is where we can add user authentication and other request-specific data
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  
  return {
    db,
    req,
    res,
  };
};

/**
 * Initialize tRPC with superjson transformer for better serialization
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Export reusable router and procedure builders
 */
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
