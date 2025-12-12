"use server";

import { Pool } from 'pg';

// Lazy initialization of connection pool
let pool: Pool | null = null;

// Initialize pool only when needed (not during build)
function getPool(): Pool | null {
  // Don't initialize during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('⚠️ PostgreSQL: Skipping initialization during build phase');
    return null;
  }

  // If POSTGRES_URL is not set, return null (fallback to Appwrite)
  if (!process.env.POSTGRES_URL) {
    console.warn('⚠️ PostgreSQL: POSTGRES_URL environment variable not set. Falling back to Appwrite.');
    return null;
  }

  console.log('🔄 PostgreSQL: Initializing connection pool...');
  console.log('📍 PostgreSQL: Connection string exists:', !!process.env.POSTGRES_URL);
  console.log('📍 PostgreSQL: Connection string length:', process.env.POSTGRES_URL?.length || 0);

  // Create pool if it doesn't exist
  if (!pool) {
    try {
      // Ensure SSL is enabled for Supabase (required)
      let connectionString = process.env.POSTGRES_URL || '';
      
      // Add sslmode=require if not already present (required for Supabase)
      if (connectionString && !connectionString.includes('sslmode=')) {
        connectionString += (connectionString.includes('?') ? '&' : '?') + 'sslmode=require';
      }
      
      pool = new Pool({
        connectionString: connectionString,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : { rejectUnauthorized: false },
      });

      // Test the connection (only log, don't exit on error during build)
      pool.on('connect', () => {
        console.log('✅ PostgreSQL: Connected to database');
      });

      pool.on('error', (err) => {
        console.error('❌ PostgreSQL: Unexpected error on idle client', err);
        console.error('❌ PostgreSQL: Error details:', err.message);
        // Don't exit during build - just log the error
        if (process.env.NEXT_PHASE !== 'phase-production-build') {
          // Only exit in runtime, not during build
          console.warn('⚠️ PostgreSQL: Connection error (non-fatal):', err.message);
        }
      });
      
      console.log('✅ PostgreSQL: Pool created successfully');
    } catch (error: any) {
      console.error('❌ PostgreSQL: Failed to initialize pool:', error);
      console.error('❌ PostgreSQL: Error message:', error?.message);
      console.error('❌ PostgreSQL: Error stack:', error?.stack);
      return null;
    }
  }

  return pool;
}

// Helper function to execute queries
export async function query(text: string, params?: any[]) {
  console.log('🔄 PostgreSQL: Attempting to execute query...');
  const poolInstance = getPool();
  
  // If pool is not available, throw error (will be caught and fallback to Appwrite)
  if (!poolInstance) {
    console.warn('⚠️ PostgreSQL: Pool not available, cannot execute query');
    throw new Error('PostgreSQL not available');
  }

  const start = Date.now();
  try {
    console.log('🔄 PostgreSQL: Executing query:', text.substring(0, 100) + '...');
    const res = await poolInstance.query(text, params);
    const duration = Date.now() - start;
    console.log('✅ PostgreSQL: Query executed successfully', { duration, rows: res.rowCount });
    return res;
  } catch (error: any) {
    console.error('❌ PostgreSQL: Database query error:', error);
    console.error('❌ PostgreSQL: Error message:', error?.message);
    console.error('❌ PostgreSQL: Error code:', error?.code);
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

