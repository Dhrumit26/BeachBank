import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const getPlaidEnvironment = () => {
  const env = process.env.PLAID_ENV;
  if (!env) {
    throw new Error('PLAID_ENV environment variable is required');
  }
  switch (env) {
    case 'production':
      return PlaidEnvironments.production;
    case 'development':
      return PlaidEnvironments.development;
    case 'sandbox':
      return PlaidEnvironments.sandbox;
    default:
      throw new Error(`Invalid PLAID_ENV value: ${env}. Must be 'sandbox', 'development', or 'production'`);
  }
};

const configuration = new Configuration({
  basePath: getPlaidEnvironment(),
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    }
  }
})

export const plaidClient = new PlaidApi(configuration);