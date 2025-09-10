/**
 * tRPC API handler for Next.js
 * This enables tRPC endpoints at /api/trpc/*
 */
import { createNextApiHandler } from '@trpc/server/adapters/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import { appRouter } from '../../../server/api/root';
import { createTRPCContext } from '../../../lib/trpc/trpc';

// Export API handler for Next.js with proper typing
const handler = createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    process.env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
          );
        }
      : undefined,
});

export default function trpcHandler(req: NextApiRequest, res: NextApiResponse) {
  return handler(req, res);
}
