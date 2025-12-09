'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";

import { plaidClient } from '@/lib/plaid';
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

// Helper function to clean up Auth user (handles 404 errors gracefully)
async function cleanupAuthUser(userService: any, userId: string) {
  try {
    await userService.delete(userId);
    console.log('Auth user cleaned up successfully');
  } catch (cleanupError: any) {
    // Ignore 404 errors (user might not exist or already deleted)
    if (cleanupError?.code === 404 || cleanupError?.type === 'user_not_found') {
      console.log('Auth user already deleted or not found');
    } else {
      console.error('Error cleaning up Auth user:', cleanupError);
    }
  }
}

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )

    if (!user.documents || user.documents.length === 0) {
      console.log(`No database document found for userId: ${userId}`);
      console.log(`Total documents in collection: ${user.total}`);
      return null;
    }

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.error('Error in getUserInfo:', error)
    return null;
  }
}

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();
    // const response = await account.createEmailPasswordSession(email, password);
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    const user = await getUserInfo({ userId: session.userId }) 

    if (!user) {
      // User exists in Auth but not in database - this can happen if sign-up didn't complete
      // Return basic session info so user can still access the app
      console.warn(`User ${session.userId} authenticated but no database document found`);
      return parseStringify({
        $id: session.userId,
        userId: session.userId,
        email: email,
      });
    }

    return parseStringify(user);
    // return parseStringify(response);
  } catch (error: any) {
    console.error('Sign in error:', error);
    // Re-throw error so it can be handled by the UI
    throw new Error(error?.message || 'Failed to sign in. Please check your credentials and try again.');
  }
}

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName } = userData;
  
  let newUserAccount;

  try {
    const { account, database, user } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(), 
      email, 
      password, 
      `${firstName} ${lastName}`
    );

    if(!newUserAccount) throw new Error('Error creating user')

    // Format dateOfBirth for Dwolla (must be YYYY-MM-DD format)
    // Validate the date format
    if (!userData.dateOfBirth || !userData.dateOfBirth.trim()) {
      // Clean up Auth user if validation fails
      await cleanupAuthUser(user, newUserAccount.$id);
      throw new Error('Date of birth is required');
    }

    // Check if already in YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    let formattedDateOfBirth = userData.dateOfBirth.trim();
    
    if (!dateRegex.test(formattedDateOfBirth)) {
      // Try to parse and reformat if not in correct format
      try {
        const date = new Date(formattedDateOfBirth);
        if (isNaN(date.getTime()) || date.getFullYear() < 1900 || date.getFullYear() > new Date().getFullYear()) {
          // Clean up Auth user if validation fails
          await cleanupAuthUser(user, newUserAccount.$id);
          throw new Error('Invalid date format. Please enter a valid date in YYYY-MM-DD format (e.g., 1990-01-15).');
        }
        formattedDateOfBirth = date.toISOString().split('T')[0];
      } catch (error: any) {
        console.error('Error formatting dateOfBirth:', error);
        // Clean up Auth user if validation fails
        await cleanupAuthUser(user, newUserAccount.$id);
        // Re-throw the error if it's already our custom error
        if (error.message && error.message.includes('Invalid date format')) {
          throw error;
        }
        throw new Error('Invalid date of birth format. Please use YYYY-MM-DD format (e.g., 1990-01-15).');
      }
    }

    console.log('Creating Dwolla customer for:', email);
    const dwollaCustomerUrl = await createDwollaCustomer({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      type: 'personal',
      address1: userData.address1,
      city: userData.city,
      state: userData.state,
      postalCode: userData.postalCode,
      dateOfBirth: formattedDateOfBirth,
      ssn: userData.ssn
    })

    console.log('Dwolla customer URL:', dwollaCustomerUrl);

    if(!dwollaCustomerUrl) {
      console.error('Dwolla customer creation failed - cleaning up Auth user');
      // Clean up Auth user if Dwolla fails
      await cleanupAuthUser(user, newUserAccount.$id);
      throw new Error('Error creating Dwolla customer. Please check your information and try again.');
    }

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    console.log('Creating database document for user:', newUserAccount.$id);
    console.log('Database ID:', DATABASE_ID);
    console.log('Collection ID:', USER_COLLECTION_ID);

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl
      }
    )

    console.log('Database document created successfully:', newUser.$id);

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error('Error in signUp:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    // Re-throw error so it can be handled by the UI
    throw error;
  }
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id})

    if (!user) {
      return null;
    }

    return parseStringify(user);
  } catch (error) {
    console.log(error)
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    cookies().delete('appwrite-session');

    await account.deleteSession('current');
  } catch (error) {
    return null;
  }
}

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ['auth'] as Products[], // 'auth' is required for processor tokens with Dwolla
      language: 'en',
      country_codes: ['US'] as CountryCode[],
    }

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: response.data.link_token })
  } catch (error) {
    console.error('Error creating Plaid link token:', error);
    throw error;
  }
}

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      }
    )

    return parseStringify(bankAccount);
  } catch (error) {
    console.log(error);
  }
}

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    
    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    // Note: The account must support money movement (ACH transfers)
    // In Plaid Sandbox, use test institutions like: First Platypus Bank, Tartan Bank, or Houndstooth Bank
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    let processorToken;
    try {
      const processorTokenResponse = await plaidClient.processorTokenCreate(request);
      processorToken = processorTokenResponse.data.processor_token;
    } catch (processorError: any) {
      console.error('Error creating processor token:', processorError);
      throw new Error('This bank account does not support money movement. Please try linking a different institution. In Plaid Sandbox, use: First Platypus Bank, Tartan Bank, or Houndstooth Bank.');
    }

     // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
     console.log('Creating funding source for bank:', accountData.name);
     const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });
    
    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) {
      console.error('Funding source URL was not created');
      throw new Error('Failed to create funding source. Please try again or contact support.');
    }
    
    console.log('Funding source URL created:', fundingSourceUrl);

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error("An error occurred while creating exchanging token:", error);
  }
}

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const { database } = await createAdminClient();

    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )

    return parseStringify(banks.documents);
  } catch (error) {
    console.log(error)
  }
}

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('$id', [documentId])]
    )

    if (!bank.documents || bank.documents.length === 0) {
      return null;
    }

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.error('Error in getBank:', error);
    return null;
  }
}

export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('accountId', [accountId])]
    )

    if(bank.total !== 1 || !bank.documents || bank.documents.length === 0) {
      return null;
    }

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.error('Error in getBankByAccountId:', error);
    return null;
  }
}