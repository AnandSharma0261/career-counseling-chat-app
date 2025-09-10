/**
 * Database migration script
 * Creates the database tables and applies schema changes
 */
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

async function runMigrations() {
  console.log('Running database migrations...');
  
  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('✅ Database migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    sqlite.close();
  }
}

if (require.main === module) {
  runMigrations();
}

export { runMigrations };
