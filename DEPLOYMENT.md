# Deployment Guide - Banking App

## 🤖 CI/CD with GitHub Actions

We've set up automated CI/CD workflows! See `.github/workflows/` for:
- **ci.yml** - Automated builds and tests on every push/PR
- **deploy-vercel.yml** - Auto-deploy to Vercel on main branch
- **deploy-netlify.yml** - Auto-deploy to Netlify on main branch

### Quick Setup for GitHub Actions:

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Add GitHub Secrets**
   - Go to: Repository → Settings → Secrets and variables → Actions
   - Add all environment variables as secrets (see `.github/workflows/README.md`)

3. **Workflows will run automatically!**
   - Every push triggers CI
   - Push to main/master triggers deployment

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Easiest for Next.js)

Vercel is the best choice for Next.js applications. It's free for personal projects and handles everything automatically.

#### Steps:

1. **Install Vercel CLI** (optional, or use web interface)
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard** (Easiest)
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your repository or upload the zip file
   - Configure environment variables (see below)
   - Click "Deploy"

3. **Deploy via CLI**
   ```bash
   vercel
   ```
   Follow the prompts and add environment variables when asked.

#### Environment Variables to Add in Vercel:

Go to Project Settings → Environment Variables and add:

```
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
NEXT_APPWRITE_KEY=your_appwrite_key
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_USER_COLLECTION_ID=your_user_collection_id
APPWRITE_BANK_COLLECTION_ID=your_bank_collection_id
APPWRITE_TRANSACTION_COLLECTION_ID=your_transaction_collection_id

# Plaid Configuration
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret

# Dwolla Configuration
DWOLLA_KEY=your_dwolla_key
DWOLLA_SECRET=your_dwolla_secret
DWOLLA_ENV=sandbox

# Sentry (Optional - if using)
SENTRY_AUTH_TOKEN=your_sentry_token
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

**Important:** 
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Other variables are server-side only
- Make sure to add them for all environments (Production, Preview, Development)

---

### Option 2: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Drag and drop your project folder or connect GitHub
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Add environment variables in Site Settings → Environment Variables
6. Deploy

---

### Option 3: Railway

1. Go to [railway.app](https://railway.app)
2. Sign up/Login
3. Create new project
4. Deploy from GitHub or upload
5. Add environment variables
6. Deploy

---

## 📋 Pre-Deployment Checklist

- [ ] All environment variables are ready
- [ ] Appwrite database and collections are set up
- [ ] Plaid account is configured (Sandbox for testing)
- [ ] Dwolla account is configured (Sandbox for testing)
- [ ] Test the build locally: `npm run build`
- [ ] Verify all API endpoints are working

## 🔧 Build Test

Before deploying, test the build locally:

```bash
npm run build
npm run start
```

If the build succeeds, you're ready to deploy!

## 🌐 Post-Deployment

After deployment:

1. **Test the live site:**
   - Sign up a new user
   - Connect a bank account (use Plaid Sandbox test institutions)
   - Make a test transfer
   - Verify transactions appear

2. **Update API redirect URLs:**
   - Update Plaid redirect URLs in Plaid Dashboard
   - Update Appwrite allowed origins if needed
   - Update Dwolla webhook URLs if using webhooks

3. **Monitor:**
   - Check Vercel/Netlify logs for errors
   - Monitor Sentry for any issues
   - Test all features on the live site

## 🐛 Troubleshooting

**Build fails:**
- Check environment variables are all set
- Verify all dependencies are in package.json
- Check build logs for specific errors

**API errors:**
- Verify all API keys are correct
- Check API service dashboards for any issues
- Ensure redirect URLs are configured correctly

**Runtime errors:**
- Check browser console for client-side errors
- Check server logs for server-side errors
- Verify all environment variables are accessible

## 📝 Notes

- For production, switch Plaid and Dwolla from `sandbox` to `production`
- Update `DWOLLA_ENV` to `production` when ready
- Make sure to use production API keys for live transactions
- Test thoroughly in sandbox before going live

