/**
 * PostgreSQL Database configuration using Drizzle ORM
 * For production deployment with Neon/Supabase/PlanetScale
 */
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema-postgres';

// Create PostgreSQL client
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/career_chat';

// Handle both local and production database URLs
let client;
if (process.env.NODE_ENV === 'production') {
  // Production: Use connection pooling
  client = postgres(connectionString, { 
    ssl: 'require',
    max: 1, // Vercel recommends small pool size
  });
} else {
  // Development: Regular connection
  client = postgres(connectionString);
}

// Create Drizzle database instance
export const db = drizzle(client, { schema });

export default db;
