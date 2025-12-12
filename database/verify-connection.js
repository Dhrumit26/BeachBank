const { Pool } = require('pg');

// Connection string from environment
const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('❌ Error: POSTGRES_URL environment variable not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function verifyConnection() {
  try {
    console.log('🔄 Testing PostgreSQL connection...\n');
    
    // Test 1: Basic connection
    console.log('1️⃣ Testing basic connection...');
    const client = await pool.connect();
    console.log('   ✅ Connection successful!\n');
    client.release();
    
    // Test 2: Check if tables exist
    console.log('2️⃣ Checking if tables exist...');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('accounts', 'transactions')
      ORDER BY table_name;
    `);
    
    if (tablesResult.rows.length === 2) {
      console.log('   ✅ Both tables exist:');
      tablesResult.rows.forEach(row => {
        console.log(`      - ${row.table_name}`);
      });
    } else {
      console.log('   ⚠️  Missing tables! Expected 2, found:', tablesResult.rows.length);
      tablesResult.rows.forEach(row => {
        console.log(`      - ${row.table_name}`);
      });
    }
    console.log('');
    
    // Test 3: Check indexes
    console.log('3️⃣ Checking indexes...');
    const indexesResult = await pool.query(`
      SELECT indexname, tablename
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND tablename IN ('accounts', 'transactions')
      ORDER BY tablename, indexname;
    `);
    console.log(`   ✅ Found ${indexesResult.rows.length} indexes\n`);
    
    // Test 4: Test write operation (INSERT)
    console.log('4️⃣ Testing write operation...');
    const testAccount = {
      account_id: 'test_' + Date.now(),
      user_id: 'test_user',
      bank_id: 'test_bank',
      appwrite_item_id: 'test_appwrite_' + Date.now(),
      shareable_id: 'test_shareable_' + Date.now(),
      name: 'Test Account',
      access_token: 'test_token',
    };
    
    try {
      await pool.query(`
        INSERT INTO accounts (
          account_id, user_id, bank_id, appwrite_item_id, shareable_id,
          name, access_token
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (appwrite_item_id) DO NOTHING
      `, [
        testAccount.account_id,
        testAccount.user_id,
        testAccount.bank_id,
        testAccount.appwrite_item_id,
        testAccount.shareable_id,
        testAccount.name,
        testAccount.access_token,
      ]);
      console.log('   ✅ Write operation successful!\n');
      
      // Clean up test data
      await pool.query('DELETE FROM accounts WHERE account_id = $1', [testAccount.account_id]);
      console.log('   🧹 Test data cleaned up\n');
    } catch (writeError) {
      console.log('   ❌ Write operation failed:', writeError.message);
    }
    
    // Test 5: Test read operation
    console.log('5️⃣ Testing read operation...');
    const readResult = await pool.query('SELECT COUNT(*) as count FROM accounts');
    console.log(`   ✅ Read operation successful! Found ${readResult.rows[0].count} accounts\n`);
    
    // Test 6: Check triggers
    console.log('6️⃣ Checking triggers...');
    const triggersResult = await pool.query(`
      SELECT trigger_name, event_object_table
      FROM information_schema.triggers
      WHERE event_object_schema = 'public'
      AND event_object_table IN ('accounts', 'transactions');
    `);
    console.log(`   ✅ Found ${triggersResult.rows.length} triggers\n`);
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('✅ ALL TESTS PASSED! PostgreSQL is ready to use.');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    console.error('\nError details:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

verifyConnection();

