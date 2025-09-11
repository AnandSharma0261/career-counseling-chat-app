/**
 * Database connection configuration using Drizzle ORM with SQLite/Turso
 * Supports both local development and production cloud database
 */
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Create database client based on environment
let client;

try {
  const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
  
  // If running on Vercel and using file database, switch to memory
  if (process.env.VERCEL && databaseUrl.startsWith('file:')) {
    console.log('Vercel detected with file database, switching to memory database');
    client = createClient({
      url: ':memory:',
    });
  } else {
    // Use configured database URL (Turso or local)
    client = createClient({
      url: databaseUrl,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
  }
} catch (error) {
  console.error('Database connection error:', error);
  // Fallback to memory database
  client = createClient({
    url: ':memory:',
  });
}

// Create Drizzle database instance with schema
export const db = drizzle(client, { schema });

// Export database connection for use throughout the application
export default db;
