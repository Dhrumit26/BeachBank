# GitHub Actions CI/CD Workflows

This directory contains GitHub Actions workflows for automated CI/CD.

## Available Workflows

### 1. `ci.yml` - Continuous Integration
- **Triggers:** Push and Pull Requests to main/master/develop
- **Actions:**
  - Installs dependencies
  - Runs linter
  - Builds the project
  - Uploads build artifacts
  - Comments on PRs with build status

### 2. `deploy-netlify.yml` - Deploy to Netlify
- **Triggers:** Push to main/master, Manual trigger
- **Actions:**
  - Builds the project
  - Deploys to Netlify production

## Setup Instructions

### 1. Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

#### Required for All Workflows:
```
NEXT_PUBLIC_APPWRITE_ENDPOINT
NEXT_PUBLIC_APPWRITE_PROJECT
NEXT_APPWRITE_KEY
APPWRITE_DATABASE_ID
APPWRITE_USER_COLLECTION_ID
APPWRITE_BANK_COLLECTION_ID
APPWRITE_TRANSACTION_COLLECTION_ID
PLAID_CLIENT_ID
PLAID_SECRET
DWOLLA_KEY
DWOLLA_SECRET
DWOLLA_ENV
```

#### For Netlify Deployment:
```
NETLIFY_AUTH_TOKEN
NETLIFY_SITE_ID
```

### 2. Get Netlify Credentials

1. Go to Netlify Dashboard → User settings → Applications → New access token
2. Get Site ID from Site settings → General → Site details

## Workflow Behavior

- **On Push to main/master:** Runs CI, then deploys to production
- **On Pull Request:** Runs CI only, creates preview build
- **Manual Trigger:** Can manually trigger deployments from Actions tab

## Customization

You can modify the workflows to:
- Add tests
- Add code quality checks
- Deploy to different environments
- Add notifications (Slack, Discord, etc.)

