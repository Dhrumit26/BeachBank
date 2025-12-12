"use server";

import { query } from "../postgres";
import { parseStringify } from "../utils";

// Create or update an account in PostgreSQL
export const createOrUpdateAccount = async (accountData: {
  accountId: string;
  userId: string;
  bankId: string;
  appwriteItemId: string;
  shareableId: string;
  institutionId?: string;
  name: string;
  officialName?: string;
  mask?: string;
  type?: string;
  subtype?: string;
  availableBalance?: number;
  currentBalance?: number;
  accessToken: string;
  fundingSourceUrl?: string;
}) => {
  try {
    const result = await query(
      `INSERT INTO accounts (
        account_id, user_id, bank_id, appwrite_item_id, shareable_id,
        institution_id, name, official_name, mask, type, subtype,
        available_balance, current_balance, access_token, funding_source_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      ON CONFLICT (appwrite_item_id) 
      DO UPDATE SET
        account_id = EXCLUDED.account_id,
        available_balance = EXCLUDED.available_balance,
        current_balance = EXCLUDED.current_balance,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [
        accountData.accountId,
        accountData.userId,
        accountData.bankId,
        accountData.appwriteItemId,
        accountData.shareableId,
        accountData.institutionId || null,
        accountData.name,
        accountData.officialName || null,
        accountData.mask || null,
        accountData.type || null,
        accountData.subtype || null,
        accountData.availableBalance || 0,
        accountData.currentBalance || 0,
        accountData.accessToken,
        accountData.fundingSourceUrl || null,
      ]
    );

    return parseStringify(result.rows[0]);
  } catch (error) {
    console.error("Error creating/updating account in PostgreSQL:", error);
    throw error;
  }
};

// Get all accounts for a user
export const getAccountsByUserId = async (userId: string) => {
  try {
    const result = await query(
      `SELECT * FROM accounts WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    return parseStringify(result.rows);
  } catch (error) {
    console.error("Error getting accounts from PostgreSQL:", error);
    throw error;
  }
};

// Get account by appwrite item ID
export const getAccountByAppwriteItemId = async (appwriteItemId: string) => {
  try {
    const result = await query(
      `SELECT * FROM accounts WHERE appwrite_item_id = $1`,
      [appwriteItemId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return parseStringify(result.rows[0]);
  } catch (error) {
    console.error("Error getting account from PostgreSQL:", error);
    throw error;
  }
};

// Get account by bank ID
export const getAccountByBankId = async (bankId: string) => {
  try {
    const result = await query(
      `SELECT * FROM accounts WHERE bank_id = $1`,
      [bankId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return parseStringify(result.rows[0]);
  } catch (error) {
    console.error("Error getting account by bank ID from PostgreSQL:", error);
    throw error;
  }
};

// Update account balance
export const updateAccountBalance = async (
  appwriteItemId: string,
  availableBalance: number,
  currentBalance: number
) => {
  try {
    const result = await query(
      `UPDATE accounts 
       SET available_balance = $1, current_balance = $2, updated_at = CURRENT_TIMESTAMP
       WHERE appwrite_item_id = $3
       RETURNING *`,
      [availableBalance, currentBalance, appwriteItemId]
    );

    return parseStringify(result.rows[0]);
  } catch (error) {
    console.error("Error updating account balance in PostgreSQL:", error);
    throw error;
  }
};

// Delete account
export const deleteAccount = async (appwriteItemId: string) => {
  try {
    await query(`DELETE FROM accounts WHERE appwrite_item_id = $1`, [
      appwriteItemId,
    ]);
    return { success: true };
  } catch (error) {
    console.error("Error deleting account from PostgreSQL:", error);
    throw error;
  }
};

