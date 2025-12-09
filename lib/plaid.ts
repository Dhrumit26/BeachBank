import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const getPlaidEnvironment = () => {
  const env = process.env.PLAID_ENV;
  if (!env) {
    throw new Error('PLAID_ENV environment variable is required');
  }
  const envLower = env.toLowerCase();
  if (envLower === 'production') {
    return PlaidEnvironments.production;
  }
  if (envLower === 'development') {
    return PlaidEnvironments.development;
  }
  if (envLower === 'sandbox') {
    return PlaidEnvironments.sandbox;
  }
  throw new Error(`Invalid PLAID_ENV value: ${env}. Must be one of: sandbox, development, or production`);
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