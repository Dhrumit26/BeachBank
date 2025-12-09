# 🚀 Quick Start: GitHub + Netlify CI/CD

## 5-Minute Setup

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/banking-app.git
git push -u origin main
```

### 2. Get Netlify Token
- Go to: netlify.com → User settings → Applications → New access token
- Copy the token

### 3. Add GitHub Secrets
Go to: GitHub repo → Settings → Secrets → Actions → New secret

Add these 14 secrets:
- All Appwrite variables (7)
- All Plaid variables (2)
- All Dwolla variables (3)
- NETLIFY_AUTH_TOKEN (from step 2)
- NETLIFY_SITE_ID (get from Netlify after first deploy, or leave empty)

### 4. Push Again
```bash
git push origin main
```

### 5. Check Deployment
- GitHub → Actions tab (watch workflow run)
- Netlify → Your site (see deployment)

Done! 🎉
