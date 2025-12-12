"use server";

import { Pool } from 'pg';

// Lazy initialization of connection pool
let pool: Pool | null = null;

// Initialize pool only when needed (not during build)
function getPool(): Pool | null {
  // Don't initialize during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return null;
  }

  // If POSTGRES_URL is not set, return null (fallback to Appwrite)
  if (!process.env.POSTGRES_URL) {
    return null;
  }

  // Create pool if it doesn't exist
  if (!pool) {
    try {
      pool = new Pool({
        connectionString: process.env.POSTGRES_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });

      // Test the connection (only log, don't exit on error during build)
      pool.on('connect', () => {
        console.log('✅ Connected to PostgreSQL database');
      });

      pool.on('error', (err) => {
        console.error('❌ Unexpected error on idle PostgreSQL client', err);
        // Don't exit during build - just log the error
        if (process.env.NEXT_PHASE !== 'phase-production-build') {
          // Only exit in runtime, not during build
          console.warn('PostgreSQL connection error (non-fatal):', err.message);
        }
      });
    } catch (error) {
      console.warn('Failed to initialize PostgreSQL pool (non-fatal):', error);
      return null;
    }
  }

  return pool;
}

// Helper function to execute queries
export async function query(text: string, params?: any[]) {
  const poolInstance = getPool();
  
  // If pool is not available, throw error (will be caught and fallback to Appwrite)
  if (!poolInstance) {
    throw new Error('PostgreSQL not available');
  }

  const start = Date.now();
  try {
    const res = await poolInstance.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to get a client from the pool (for transactions)
export async function getClient() {
  const poolInstance = getPool();
  
  if (!poolInstance) {
    throw new Error('PostgreSQL not available');
  }

  const client = await poolInstance.connect();
  return client;
}

export default getPool;

