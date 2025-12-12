const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Connection string from environment or command line
const connectionString = process.env.POSTGRES_URL || process.argv[2];

if (!connectionString) {
  console.error('❌ Error: No connection string provided');
  console.log('Usage: node run-migration.js "postgresql://user:pass@host:port/db"');
  console.log('Or set POSTGRES_URL environment variable');
  process.exit(1);
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  try {
    console.log('🔄 Connecting to PostgreSQL...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 Running schema migration...');
    
    // Execute the schema
    await pool.query(schemaSQL);
    
    console.log('✅ Schema migration completed successfully!');
    
    // Verify tables were created
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('accounts', 'transactions')
      ORDER BY table_name;
    `);
    
    console.log('\n📊 Created tables:');
    tablesResult.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });
    
    // Check indexes
    const indexesResult = await pool.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND tablename IN ('accounts', 'transactions')
      ORDER BY indexname;
    `);
    
    console.log(`\n📇 Created ${indexesResult.rows.length} indexes`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running migration:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();

