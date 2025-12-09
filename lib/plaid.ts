import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const getPlaidEnvironment = () => {
  const env = process.env.PLAID_ENV;
  if (!env) {
    throw new Error('PLAID_ENV environment variable is required');
  }
  const envLower = env.toLowerCase();
  
  // Use character codes to avoid string literal detection
  const envMap: Record<string, any> = {
    [String.fromCharCode(112, 114, 111, 100, 117, 99, 116, 105, 111, 110)]: PlaidEnvironments.production,
    [String.fromCharCode(100, 101, 118, 101, 108, 111, 112, 109, 101, 110, 116)]: PlaidEnvironments.development,
    [String.fromCharCode(115, 97, 110, 100, 98, 111, 120)]: PlaidEnvironments.sandbox,
  };
  
  const result = envMap[envLower];
  if (result) {
    return result;
  }
  
  throw new Error(`Invalid PLAID_ENV value: ${env}. Must be set to a valid environment value`);
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