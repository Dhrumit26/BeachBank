# PostgreSQL Setup for Netlify Deployment

This guide will walk you through setting up PostgreSQL for your banking app deployed on Netlify.

## Step 1: Choose a PostgreSQL Provider

You have several options (all have free tiers):

### Option A: Supabase (Recommended - Easiest)
- **Website**: https://supabase.com
- **Free Tier**: 500MB database, 2GB bandwidth
- **Why**: Easy setup, great dashboard, built-in connection pooling

### Option B: Neon
- **Website**: https://neon.tech
- **Free Tier**: 3GB storage, unlimited projects
- **Why**: Serverless PostgreSQL, auto-scaling

### Option C: Railway
- **Website**: https://railway.app
- **Free Tier**: $5 credit/month
- **Why**: Simple deployment, good for small projects

### Option D: AWS RDS / Heroku Postgres
- More complex but enterprise-grade

---

## Step 2: Set Up PostgreSQL Database (Using Supabase as Example)

### 2.1 Create Supabase Account

1. Go to https://supabase.com
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with GitHub (recommended) or email
4. Verify your email if needed

### 2.2 Create a New Project

1. Click **"New Project"** button
2. Fill in the form:
   - **Name**: `banking-app` (or any name)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to your users (e.g., `US East`)
   - **Pricing Plan**: Free (or Pro if you need more)
3. Click **"Create new project"**
4. Wait 2-3 minutes for project to be created

### 2.3 Get Your Connection String

1. Once project is ready, go to **Settings** (gear icon in left sidebar)
2. Click **"Database"** in the settings menu
3. Scroll down to **"Connection string"** section
4. Select **"URI"** tab
5. Copy the connection string (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. **IMPORTANT**: Replace `[YOUR-PASSWORD]` with the password you created in step 2.2
   - Example: `postgresql://postgres:MyPassword123@db.abcdefgh.supabase.co:5432/postgres`

---

## Step 3: Run Database Schema Migration

### 3.1 Install PostgreSQL Client (if not installed)

**On macOS:**
```bash
brew install postgresql
```

**On Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Or use Supabase SQL Editor (easier - see 3.2)

**On Linux:**
```bash
sudo apt-get install postgresql-client
```

### 3.2 Run Schema Migration

**Option A: Using Supabase SQL Editor (Easiest)**

1. In Supabase dashboard, click **"SQL Editor"** in left sidebar
2. Click **"New query"**
3. Open the file `database/schema.sql` from your project
4. Copy ALL the contents
5. Paste into Supabase SQL Editor
6. Click **"Run"** button (or press Cmd/Ctrl + Enter)
7. You should see: "Success. No rows returned"

**Option B: Using psql Command Line**

1. Open terminal
2. Navigate to your project:
   ```bash
   cd /Users/dhrumitsavaliya/Desktop/491B/banking
   ```
3. Run the schema:
   ```bash
   psql "YOUR_CONNECTION_STRING_HERE" -f database/schema.sql
   ```
   Replace `YOUR_CONNECTION_STRING_HERE` with the connection string from Step 2.3

4. You should see output like:
   ```
   CREATE TABLE
   CREATE INDEX
   CREATE FUNCTION
   CREATE TRIGGER
   ```

### 3.3 Verify Tables Were Created

**In Supabase:**
1. Go to **"Table Editor"** in left sidebar
2. You should see two tables: `accounts` and `transactions`

**Or using SQL:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

---

## Step 4: Add PostgreSQL Connection to Netlify

### 4.1 Get Your Connection String (Again)

Make sure you have your connection string ready:
```
postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
```

### 4.2 Add Environment Variable to Netlify

1. Go to https://app.netlify.com
2. Click on your site (e.g., `beachbank`)
3. Go to **"Site configuration"** (or click **"Configuration"** in top menu)
4. Click **"Environment variables"** in the left sidebar
5. Click **"Add a variable"** button
6. Fill in:
   - **Key**: `POSTGRES_URL`
   - **Value**: Paste your connection string from Step 2.3
   - **Scopes**: Select **"All scopes"** (or at least "Production")
7. Click **"Save"**

### 4.3 Verify Environment Variable

1. Scroll down to see all environment variables
2. Make sure `POSTGRES_URL` is listed
3. The value should be hidden (showing dots) for security

---

## Step 5: Update GitHub Secrets (For CI/CD)

If you're using GitHub Actions for deployment:

1. Go to your GitHub repository: https://github.com/Dhrumit26/BeachBank
2. Click **"Settings"** tab
3. Click **"Secrets and variables"** → **"Actions"**
4. Click **"New repository secret"**
5. Fill in:
   - **Name**: `POSTGRES_URL`
   - **Secret**: Paste your connection string
6. Click **"Add secret"**

---

## Step 6: Redeploy on Netlify

### 6.1 Trigger a New Deploy

**Option A: Clear Cache and Redeploy**
1. In Netlify dashboard, go to **"Deploys"** tab
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Wait for deployment to complete

**Option B: Push a Commit**
```bash
git add .
git commit -m "Add PostgreSQL integration"
git push
```

### 6.2 Verify Deployment

1. Go to **"Deploys"** tab in Netlify
2. Wait for build to complete (should show "Published")
3. Click on the deploy to see logs
4. Check for any errors related to PostgreSQL

---

## Step 7: Test PostgreSQL Connection

### 7.1 Check Application Logs

1. In Netlify, go to **"Functions"** tab (if using serverless functions)
2. Or check **"Deploys"** → Latest deploy → **"View logs"**
3. Look for: `✅ Connected to PostgreSQL database`

### 7.2 Test in Application

1. Visit your site: https://beachbank.netlify.app
2. Sign in to your account
3. Link a bank account (if not already linked)
4. Make a test transfer
5. Check if transactions are being saved

### 7.3 Verify in Database

**In Supabase:**
1. Go to **"Table Editor"**
2. Click on `accounts` table
3. You should see your bank accounts (if any are linked)
4. Click on `transactions` table
5. You should see transactions (if any transfers were made)

---

## Step 8: Troubleshooting

### Issue: "Connection refused" or "Connection timeout"

**Solution:**
- Check if your connection string is correct
- For Supabase, make sure you replaced `[YOUR-PASSWORD]` with actual password
- Check if your IP is allowed (Supabase allows all by default)
- Verify the database is running (check Supabase dashboard)

### Issue: "SSL required"

**Solution:**
- Add `?sslmode=require` to your connection string:
  ```
  postgresql://postgres:password@host:5432/postgres?sslmode=require
  ```

### Issue: "Table does not exist"

**Solution:**
- Make sure you ran the schema migration (Step 3)
- Check in Supabase SQL Editor: `SELECT * FROM accounts LIMIT 1;`
- If error, re-run `database/schema.sql`

### Issue: "Environment variable not found"

**Solution:**
- Verify `POSTGRES_URL` is set in Netlify environment variables
- Make sure it's set for the correct scope (Production/Preview/Development)
- Redeploy after adding the variable

### Issue: "Too many connections"

**Solution:**
- This is normal with connection pooling
- The code already uses a connection pool
- If persistent, consider upgrading your database plan

---

## Step 9: Security Best Practices

1. **Never commit connection strings to Git**
   - Already in `.gitignore`, but double-check

2. **Use connection pooling** (Already implemented)
   - The `lib/postgres.ts` uses a connection pool

3. **Rotate passwords regularly**
   - Change database password in Supabase settings
   - Update `POSTGRES_URL` in Netlify

4. **Use environment-specific databases**
   - Production: Production database
   - Preview: Separate test database

---

## Quick Reference: Connection Strings by Provider

### Supabase
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Neon
```
postgresql://[user]:[password]@[neon-hostname]/[dbname]?sslmode=require
```

### Railway
```
postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/railway
```

---

## Summary Checklist

- [ ] Created PostgreSQL database (Supabase/Neon/Railway)
- [ ] Got connection string
- [ ] Ran database schema migration (`database/schema.sql`)
- [ ] Verified tables exist (`accounts`, `transactions`)
- [ ] Added `POSTGRES_URL` to Netlify environment variables
- [ ] Added `POSTGRES_URL` to GitHub Secrets (if using CI/CD)
- [ ] Redeployed on Netlify
- [ ] Verified connection in logs
- [ ] Tested application functionality
- [ ] Verified data in database

---

## Need Help?

If you encounter issues:
1. Check Netlify deploy logs
2. Check Supabase/Neon logs
3. Verify connection string format
4. Test connection locally first: `psql "YOUR_CONNECTION_STRING"`

