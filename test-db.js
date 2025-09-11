// Quick database test script
const { drizzle } = require('drizzle-orm/libsql');
const { createClient } = require('@libsql/client');

async function testDatabase() {
  try {
    const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
    console.log('Testing database:', databaseUrl);
    
    const client = createClient({
      url: databaseUrl,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
    
    const db = drizzle(client);
    
    // Test basic query
    const result = await db.run(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name;
    `);
    
    console.log('Tables found:', result);
    
    // Try to create users table if it doesn't exist
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        image TEXT,
        email_verified INTEGER,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
      );
    `);
    
    console.log('✅ Database test successful');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
  
  process.exit(0);
}

testDatabase();
