# 🚀 Complete Guide: GitHub CI/CD + Netlify Deployment

## Step-by-Step Instructions

---

## 📋 Prerequisites

- GitHub account
- Netlify account (free tier works)
- All your API keys ready (Appwrite, Plaid, Dwolla)

---

## Step 1: Push Your Code to GitHub

### 1.1 Initialize Git Repository (if not already done)

```bash
cd /Users/dhrumitsavaliya/Desktop/491B/banking

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit with CI/CD setup"
```

### 1.2 Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the **"+"** icon → **"New repository"**
3. Repository name: `banking-app` (or any name you prefer)
4. Description: "Banking application for university students"
5. Choose: **Private** or **Public**
6. **DO NOT** initialize with README, .gitignore, or license
7. Click **"Create repository"**

### 1.3 Push Code to GitHub

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/banking-app.git

# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/banking-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**✅ Check:** Go to your GitHub repository and verify all files are there.

---

## Step 2: Get Netlify Credentials

### 2.1 Create Netlify Account

1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login (you can use GitHub to sign in)

### 2.2 Get Netlify Access Token

1. Go to: **User settings** → **Applications** → **New access token**
2. Token name: `github-actions-deploy`
3. Click **"Generate token"**
4. **COPY THE TOKEN** (you'll need it in Step 3)
   - It looks like: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2.3 Create Netlify Site (Get Site ID)

**Option A: Create site manually first**

1. Go to Netlify Dashboard
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy manually"**
4. Site name: `banking-app` (or your preferred name)
5. Click **"Deploy site"**
6. Go to **Site settings** → **General** → **Site details**
7. **COPY THE SITE ID** (you'll need it in Step 3)
   - It looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

**Option B: Let GitHub Actions create it automatically**

- You can skip this and the workflow will create the site, but you'll need to get the Site ID from Netlify after first deployment.

---

## Step 3: Add GitHub Secrets

### 3.1 Go to GitHub Secrets

1. Go to your GitHub repository
2. Click **"Settings"** tab
3. In left sidebar: **"Secrets and variables"** → **"Actions"**
4. Click **"New repository secret"**

### 3.2 Add All Required Secrets

Add each secret one by one (click "New repository secret" for each):

#### Appwrite Secrets:
```
Name: NEXT_PUBLIC_APPWRITE_ENDPOINT
Value: https://cloud.appwrite.io/v1 (or your endpoint)
```

```
Name: NEXT_PUBLIC_APPWRITE_PROJECT
Value: your_appwrite_project_id
```

```
Name: NEXT_APPWRITE_KEY
Value: your_appwrite_api_key
```

```
Name: APPWRITE_DATABASE_ID
Value: your_database_id
```

```
Name: APPWRITE_USER_COLLECTION_ID
Value: your_user_collection_id
```

```
Name: APPWRITE_BANK_COLLECTION_ID
Value: your_bank_collection_id
```

```
Name: APPWRITE_TRANSACTION_COLLECTION_ID
Value: your_transaction_collection_id
```

#### Plaid Secrets:
```
Name: PLAID_CLIENT_ID
Value: your_plaid_client_id
```

```
Name: PLAID_SECRET
Value: your_plaid_secret
```

#### Dwolla Secrets:
```
Name: DWOLLA_KEY
Value: your_dwolla_key
```

```
Name: DWOLLA_SECRET
Value: your_dwolla_secret
```

```
Name: DWOLLA_ENV
Value: sandbox
```

#### Netlify Secrets:
```
Name: NETLIFY_AUTH_TOKEN
Value: your_netlify_access_token (from Step 2.2)
```

```
Name: NETLIFY_SITE_ID
Value: your_netlify_site_id (from Step 2.3, or leave empty for first deploy)
```

**✅ Check:** You should have **14 secrets** total in your GitHub repository.

---

## Step 4: Configure GitHub Actions Workflow

The workflow files are already created! But let's verify and customize if needed.

### 4.1 Check Workflow Files

The following files should exist:
- `.github/workflows/ci.yml` ✅
- `.github/workflows/deploy-netlify.yml` ✅

### 4.2 Update Branch Name (if needed)

If your main branch is called `master` instead of `main`, update the workflow:

Open `.github/workflows/deploy-netlify.yml` and change:
```yaml
branches: [ main, master ]
```
to:
```yaml
branches: [ master ]  # or whatever your branch name is
```

---

## Step 5: Test the CI/CD Pipeline

### 5.1 Make a Test Commit

```bash
# Make a small change (or just update README)
echo "# Test CI/CD" >> README.md

# Commit and push
git add .
git commit -m "Test CI/CD pipeline"
git push origin main
```

### 5.2 Check GitHub Actions

1. Go to your GitHub repository
2. Click **"Actions"** tab
3. You should see:
   - **"CI/CD Pipeline"** workflow running
   - **"Deploy to Netlify"** workflow running

### 5.3 Monitor the Workflow

1. Click on the running workflow
2. Click on the job (e.g., "build-and-deploy")
3. Watch the logs in real-time
4. Wait for it to complete (usually 2-5 minutes)

**✅ Success indicators:**
- All steps show green checkmarks ✅
- "Deploy to Netlify" step completes
- No red X marks ❌

---

## Step 6: Verify Deployment

### 6.1 Check Netlify Dashboard

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click on your site
3. Go to **"Deploys"** tab
4. You should see a new deployment with status **"Published"**

### 6.2 Get Your Live URL

1. In Netlify Dashboard → Your site
2. You'll see your site URL at the top
   - Example: `https://banking-app-12345.netlify.app`
3. Click the URL to open your live site

### 6.3 Test the Live Site

1. **Sign up** a new user
2. **Connect a bank account** (use Plaid Sandbox test institutions)
3. **Make a test transfer**
4. Verify everything works

---

## Step 7: Update API Redirect URLs

### 7.1 Update Plaid Redirect URLs

1. Go to [Plaid Dashboard](https://dashboard.plaid.com)
2. Go to **Team Settings** → **Allowed redirect URIs**
3. Add your Netlify URL:
   ```
   https://your-site-name.netlify.app
   ```

### 7.2 Update Appwrite Allowed Origins (if needed)

1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Go to your project → **Settings** → **Web**
3. Add your Netlify URL to **Allowed Origins**

---

## 🔄 How It Works Going Forward

### Automatic Deployment Flow:

1. **You make changes** → Edit code locally
2. **Commit and push** → `git push origin main`
3. **GitHub Actions triggers** → Automatically runs
4. **CI runs** → Builds and tests your code
5. **Deploy runs** → Automatically deploys to Netlify
6. **Site updates** → Your live site is updated in 2-5 minutes

### For Pull Requests:

1. **Create a branch** → `git checkout -b feature/new-feature`
2. **Make changes** → Edit code
3. **Push branch** → `git push origin feature/new-feature`
4. **Create PR** → On GitHub, create a pull request
5. **CI runs** → Builds and tests (but doesn't deploy)
6. **Review** → Team reviews the PR
7. **Merge** → When merged to main, it auto-deploys

---

## 🐛 Troubleshooting

### Issue: Workflow fails with "NETLIFY_AUTH_TOKEN not found"

**Solution:**
- Go to GitHub → Settings → Secrets
- Verify `NETLIFY_AUTH_TOKEN` is added
- Make sure the name matches exactly (case-sensitive)

### Issue: Build fails with environment variable errors

**Solution:**
- Check all secrets are added in GitHub
- Verify secret names match exactly (no typos)
- Check the workflow file uses the correct secret names

### Issue: Deployment succeeds but site shows errors

**Solution:**
1. Check Netlify build logs: Site → Deploys → Click on deployment → View logs
2. Verify all environment variables are set in Netlify:
   - Go to Site settings → Environment variables
   - Add all the same variables you added to GitHub Secrets
3. Check browser console for client-side errors

### Issue: Site not updating after push

**Solution:**
- Check GitHub Actions tab - is the workflow running?
- Check Netlify Deploys tab - is there a new deployment?
- Try triggering manually: Actions → Deploy to Netlify → Run workflow

---

## 📝 Quick Reference Commands

```bash
# Check workflow status
# Go to: GitHub → Actions tab

# View deployment logs
# Go to: Netlify → Your site → Deploys → Click deployment

# Manually trigger deployment
# Go to: GitHub → Actions → Deploy to Netlify → Run workflow

# Check your site URL
# Go to: Netlify → Your site → Overview → Site URL
```

---

## ✅ Success Checklist

- [ ] Code pushed to GitHub
- [ ] All 14 secrets added to GitHub
- [ ] Netlify account created
- [ ] Netlify access token generated
- [ ] Netlify site created (or Site ID obtained)
- [ ] GitHub Actions workflow runs successfully
- [ ] Site deployed to Netlify
- [ ] Live site URL obtained
- [ ] Plaid redirect URLs updated
- [ ] Appwrite allowed origins updated
- [ ] Tested sign up on live site
- [ ] Tested bank connection on live site
- [ ] Tested transfer on live site

---

## 🎉 You're Done!

Your banking app now has:
- ✅ Automated CI/CD pipeline
- ✅ Automatic deployments on every push
- ✅ Build testing on every change
- ✅ Live site on Netlify

Every time you push code, it will automatically deploy! 🚀

