# PostgreSQL Database Setup

This project uses PostgreSQL for storing accounts and transactions data.

## Prerequisites

- PostgreSQL 12+ installed locally, or
- A PostgreSQL database service (e.g., Supabase, Neon, Railway, AWS RDS)

## Setup Instructions

### 1. Create a PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# Create database
createdb banking_app

# Or using psql
psql -U postgres
CREATE DATABASE banking_app;
```

**Option B: Cloud PostgreSQL (Recommended for Production)**
- **Supabase**: https://supabase.com (Free tier available)
- **Neon**: https://neon.tech (Free tier available)
- **Railway**: https://railway.app
- **AWS RDS**: https://aws.amazon.com/rds/

### 2. Run the Schema Migration

```bash
# Connect to your database and run the schema
psql -U postgres -d banking_app -f database/schema.sql

# Or if using a connection string
psql "postgresql://user:password@host:port/database" -f database/schema.sql
```

### 3. Set Environment Variable

Add to your `.env` file:

```env
# PostgreSQL Connection String
POSTGRES_URL=postgresql://username:password@localhost:5432/banking_app

# For cloud providers, use their connection string format:
# Supabase: postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
# Neon: postgresql://[user]:[password]@[neon-hostname]/[dbname]?sslmode=require
```

### 4. Verify Connection

The application will automatically connect to PostgreSQL on startup. Check your console logs for:
```
✅ Connected to PostgreSQL database
```

## Database Schema

### Tables

1. **accounts** - Stores bank account information
   - Links to Appwrite bank records via `appwrite_item_id`
   - Stores balances, account details, and access tokens

2. **transactions** - Stores all transactions including transfers
   - Supports both Plaid transactions and internal transfers
   - Indexed for fast queries by account, bank, and date

## Migration from Appwrite

The application uses a **hybrid approach**:
- **PostgreSQL** (primary) for accounts and transactions
- **Appwrite** (fallback) if PostgreSQL is unavailable

This ensures backward compatibility while migrating to PostgreSQL.

## Troubleshooting

### Connection Issues

1. **Check connection string format:**
   ```
   postgresql://username:password@host:port/database
   ```

2. **Verify database exists:**
   ```bash
   psql -U postgres -l
   ```

3. **Check network/firewall settings** (for cloud databases)

### SSL Issues (Cloud Providers)

For cloud PostgreSQL providers, you may need SSL:
```env
POSTGRES_URL=postgresql://user:pass@host:port/db?sslmode=require
```

## Production Considerations

1. **Connection Pooling**: Already configured in `lib/postgres.ts`
2. **Indexes**: Created automatically in schema.sql for performance
3. **Backups**: Set up regular backups for production databases
4. **Monitoring**: Monitor query performance and connection pool usage

