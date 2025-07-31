import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema';

let db: ReturnType<typeof drizzle> | null = null;

export function getDatabase() {
  if (!db && process.env.DATABASE_URL) {
    try {
      const sql = neon(process.env.DATABASE_URL);
      db = drizzle(sql, { schema });
      console.log('Database connection established');
    } catch (error) {
      console.error('Failed to connect to database:', error);
      return null;
    }
  }
  return db;
}

export function isDatabaseConnected(): boolean {
  return db !== null;
}