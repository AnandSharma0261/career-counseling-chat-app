// Create tables manually
const { drizzle } = require('drizzle-orm/libsql');
const { createClient } = require('@libsql/client');

async function createTables() {
  try {
    const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
    console.log('Creating tables in:', databaseUrl);
    
    const client = createClient({
      url: databaseUrl,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
    
    const db = drizzle(client);
    
    // Create users table
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT ('usr_' || lower(hex(randomblob(8)))),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        image TEXT,
        email_verified INTEGER DEFAULT 0,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
      );
    `);
    
    // Create accounts table for OAuth
    await db.run(`
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY DEFAULT ('acc_' || lower(hex(randomblob(8)))),
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        provider_account_id TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INTEGER,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(provider, provider_account_id)
      );
    `);
    
    // Create sessions table
    await db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY DEFAULT ('ses_' || lower(hex(randomblob(8)))),
        session_token TEXT UNIQUE NOT NULL,
        user_id TEXT NOT NULL,
        expires INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    
    // Create verification_tokens table
    await db.run(`
      CREATE TABLE IF NOT EXISTS verification_tokens (
        identifier TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires INTEGER NOT NULL,
        PRIMARY KEY (identifier, token)
      );
    `);
    
    // Create chat_sessions table
    await db.run(`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id TEXT PRIMARY KEY DEFAULT ('chat_' || lower(hex(randomblob(8)))),
        user_id TEXT NOT NULL,
        title TEXT NOT NULL DEFAULT 'New Chat',
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    
    // Create messages table
    await db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY DEFAULT ('msg_' || lower(hex(randomblob(8)))),
        chat_session_id TEXT NOT NULL,
        content TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
        status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'error')),
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (chat_session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
      );
    `);
    
    console.log('✅ All tables created successfully');
    
    // Test insert
    const testResult = await db.run(`
      INSERT OR IGNORE INTO users (name, email, password) 
      VALUES ('Test User', 'test@example.com', 'test123')
    `);
    
    console.log('✅ Test insert successful:', testResult);
    
  } catch (error) {
    console.error('❌ Table creation failed:', error);
  }
  
  process.exit(0);
}

createTables();
