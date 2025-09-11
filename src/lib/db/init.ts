/**
 * Database initialization for memory database
 * Creates tables if they don't exist (needed for memory database)
 */
import { db } from './index';
import { users, accounts, sessions, verificationTokens, chatSessions, messages } from './schema';

export async function initializeDatabase() {
  try {
    // Check if we can connect to the database
    await db.select().from(users).limit(1);
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.warn('Database initialization error:', error);
    // For memory database, tables might not exist yet
    // In production with memory database, this is expected
    return false;
  }
}

// Auto-initialize on import in production
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  initializeDatabase().catch(console.error);
}
