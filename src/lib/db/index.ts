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
let isCloudDatabase = false;

try {
  const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
  const authToken = process.env.DATABASE_AUTH_TOKEN;
  
  console.log(`🔗 Connecting to database: ${databaseUrl.substring(0, 30)}...`);
  
  if (databaseUrl.startsWith('libsql://')) {
    // Turso cloud database
    if (!authToken) {
      console.error('❌ DATABASE_AUTH_TOKEN missing for Turso database');
      throw new Error('Missing Turso auth token');
    }
    console.log('📡 Using Turso cloud database');
    client = createClient({
      url: databaseUrl,
      authToken: authToken,
    });
    isCloudDatabase = true;
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
  console.log('🆘 Falling back to memory database');
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
    if (isCloudDatabase) {
      // For cloud databases, just verify connection
      console.log('✅ Using cloud database - checking connection...');
      await db.select().from(schema.users).limit(1);
      console.log('✅ Cloud database connection verified');
      return true;
    }
    
    if (isMemoryDatabase) {
      // Initialize memory database with tables
      console.log('🔄 Initializing memory database...');
      const { initializeMemoryDatabase } = await import('./init');
      await initializeMemoryDatabase();
      console.log('✅ Memory database initialized');
      return true;
    }
    
    // For local file database, try to create tables if they don't exist
    try {
      await db.select().from(schema.users).limit(1);
      console.log('✅ Local database tables verified');
      return true;
    } catch (error) {
      console.log('⚠️  Local database tables missing, creating...');
      const { initializeMemoryDatabase } = await import('./init');
      await initializeMemoryDatabase();
      console.log('✅ Local database initialized');
      return true;
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}

// Export database connection for use throughout the application
export default db;
