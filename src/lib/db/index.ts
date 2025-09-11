/**
 * Database connection configuration using Drizzle ORM with SQLite/Turso
 * Supports both local development and production cloud database
 */
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Create database client based on environment
const client = createClient({
  url: process.env.DATABASE_URL || 'file:./dev.db',
  authToken: process.env.DATABASE_AUTH_TOKEN, // Only needed for Turso cloud
});

// Create Drizzle database instance with schema
export const db = drizzle(client, { schema });

// Export database connection for use throughout the application
export default db;
