/**
 * Database connection configuration using Drizzle ORM with SQLite/Turso
 * Supports both local development and production cloud database
 */
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Create database client based on environment
let client;
let isMemoryDatabase = false;

try {
  const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
  
  console.log(`🔗 Connecting to database: ${databaseUrl.substring(0, 20)}...`);
  
  if (databaseUrl.startsWith('libsql://')) {
    // Turso cloud database
    console.log('📡 Using Turso cloud database');
    client = createClient({
      url: databaseUrl,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
  } else if (databaseUrl.startsWith('file:') && process.env.VERCEL) {
    // Fallback to memory only on Vercel with file database
    console.log('⚠️  Vercel detected with file database, using memory fallback');
    client = createClient({
      url: ':memory:',
    });
    isMemoryDatabase = true;
  } else {
    // Local development with file database
    console.log('💻 Using local file database');
    client = createClient({
      url: databaseUrl,
    });
  }
} catch (error) {
  console.error('Database connection error:', error);
  // Final fallback to memory database
  client = createClient({
    url: ':memory:',
  });
  isMemoryDatabase = true;
}

// Create Drizzle database instance with schema
export const db = drizzle(client, { schema });

// Initialize database function
export async function ensureDbInitialized() {
  try {
    // Try to run a simple query to check if tables exist
    await db.select().from(schema.users).limit(1);
    console.log('✅ Database tables verified');
    return true;
  } catch (error) {
    console.log('⚠️  Database tables not found, attempting to create...');
    
    if (isMemoryDatabase) {
      // Initialize memory database with tables
      const { initializeMemoryDatabase } = await import('./init');
      await initializeMemoryDatabase();
      console.log('✅ Memory database initialized');
      return true;
    } else {
      // For Turso/cloud databases, tables should be created via migration
      console.error('❌ Database tables missing. Please run: npm run db:push');
      throw new Error('Database tables not found. Run migrations first.');
    }
  }
}

// Export database connection for use throughout the application
export default db;
