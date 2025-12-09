# Banking App - Setup Instructions

## Quick Start

1. **Extract the zip file**
   ```bash
   unzip banking-app-complete.zip
   cd banking
   ```

2. **Create environment file**
   - Copy `.env.example` to `.env` (if exists) or create a new `.env` file
   - Add your API keys:
     ```
     # Appwrite
     NEXT_PUBLIC_APPWRITE_ENDPOINT=your_endpoint
     NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
     NEXT_APPWRITE_KEY=your_key
     APPWRITE_DATABASE_ID=your_database_id
     APPWRITE_USER_COLLECTION_ID=your_user_collection_id
     APPWRITE_BANK_COLLECTION_ID=your_bank_collection_id
     APPWRITE_TRANSACTION_COLLECTION_ID=your_transaction_collection_id
     
     # Plaid
     PLAID_CLIENT_ID=your_plaid_client_id
     PLAID_SECRET=your_plaid_secret
     
     # Dwolla
     DWOLLA_KEY=your_dwolla_key
     DWOLLA_SECRET=your_dwolla_secret
     DWOLLA_ENV=sandbox
     ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`

## Features Included

✅ User authentication (Sign up / Sign in)
✅ Bank account connection via Plaid
✅ Money transfers between accounts
✅ Transaction history
✅ Real-time balance updates
✅ Category-based transaction tracking
✅ Dummy + Real transactions display

## Notes

- All dependencies are included in `node_modules/`
- Build cache is included in `.next/`
- No need to run `npm install` - everything is ready!
- Just add your `.env` file with API keys and run `npm run dev`

## Troubleshooting

If you encounter any issues:
1. Make sure all environment variables are set in `.env`
2. Check that all API services (Appwrite, Plaid, Dwolla) are configured
3. For Plaid Sandbox, use test institutions: First Platypus Bank, Tartan Bank, or Houndstooth Bank

