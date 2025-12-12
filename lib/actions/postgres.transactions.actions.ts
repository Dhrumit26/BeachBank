"use server";

import { query } from "../postgres";
import { parseStringify } from "../utils";

// Create a transaction in PostgreSQL
export const createTransaction = async (transactionData: {
  transactionId?: string;
  accountId?: string;
  bankId?: string;
  senderId?: string;
  receiverId?: string;
  senderBankId?: string;
  receiverBankId?: string;
  name: string;
  amount: number;
  type: string; // 'credit' or 'debit'
  category?: string;
  channel?: string;
  paymentChannel?: string;
  pending?: boolean;
  date: string;
  imageUrl?: string;
  email?: string;
}) => {
  try {
    const result = await query(
      `INSERT INTO transactions (
        transaction_id, account_id, bank_id, sender_id, receiver_id,
        sender_bank_id, receiver_bank_id, name, amount, type, category,
        channel, payment_channel, pending, date, image_url, email
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [
        transactionData.transactionId || null,
        transactionData.accountId || null,
        transactionData.bankId || null,
        transactionData.senderId || null,
        transactionData.receiverId || null,
        transactionData.senderBankId || null,
        transactionData.receiverBankId || null,
        transactionData.name,
        transactionData.amount,
        transactionData.type,
        transactionData.category || null,
        transactionData.channel || null,
        transactionData.paymentChannel || null,
        transactionData.pending || false,
        transactionData.date,
        transactionData.imageUrl || null,
        transactionData.email || null,
      ]
    );

    return parseStringify(result.rows[0]);
  } catch (error) {
    console.error("Error creating transaction in PostgreSQL:", error);
    throw error;
  }
};

// Get transactions by account ID
export const getTransactionsByAccountId = async (accountId: string, limit = 100) => {
  try {
    const result = await query(
      `SELECT * FROM transactions 
       WHERE account_id = $1 
       ORDER BY date DESC, created_at DESC 
       LIMIT $2`,
      [accountId, limit]
    );

    return parseStringify(result.rows);
  } catch (error) {
    console.error("Error getting transactions by account ID from PostgreSQL:", error);
    throw error;
  }
};

// Get transactions by bank ID (for transfers)
export const getTransactionsByBankId = async (bankId: string) => {
  try {
    const result = await query(
      `SELECT * FROM transactions 
       WHERE sender_bank_id = $1 OR receiver_bank_id = $1
       ORDER BY date DESC, created_at DESC`,
      [bankId]
    );

    return parseStringify({
      total: result.rowCount || 0,
      documents: result.rows,
    });
  } catch (error) {
    console.error("Error getting transactions by bank ID from PostgreSQL:", error);
    throw error;
  }
};

// Get transactions by user ID (all accounts)
export const getTransactionsByUserId = async (userId: string, limit = 100) => {
  try {
    // First get all account IDs for the user
    const accountsResult = await query(
      `SELECT account_id FROM accounts WHERE user_id = $1`,
      [userId]
    );

    const accountIds = accountsResult.rows.map((row) => row.account_id);

    if (accountIds.length === 0) {
      return parseStringify([]);
    }

    // Get transactions for all user's accounts
    const result = await query(
      `SELECT * FROM transactions 
       WHERE account_id = ANY($1)
       ORDER BY date DESC, created_at DESC 
       LIMIT $2`,
      [accountIds, limit]
    );

    return parseStringify(result.rows);
  } catch (error) {
    console.error("Error getting transactions by user ID from PostgreSQL:", error);
    throw error;
  }
};

// Get transaction by transaction ID
export const getTransactionById = async (transactionId: string) => {
  try {
    const result = await query(
      `SELECT * FROM transactions WHERE transaction_id = $1 OR id = $1`,
      [transactionId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return parseStringify(result.rows[0]);
  } catch (error) {
    console.error("Error getting transaction from PostgreSQL:", error);
    throw error;
  }
};

// Update transaction
export const updateTransaction = async (
  transactionId: string,
  updates: {
    pending?: boolean;
    category?: string;
    amount?: number;
  }
) => {
  try {
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.pending !== undefined) {
      updateFields.push(`pending = $${paramIndex++}`);
      values.push(updates.pending);
    }
    if (updates.category !== undefined) {
      updateFields.push(`category = $${paramIndex++}`);
      values.push(updates.category);
    }
    if (updates.amount !== undefined) {
      updateFields.push(`amount = $${paramIndex++}`);
      values.push(updates.amount);
    }

    if (updateFields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(transactionId);

    const result = await query(
      `UPDATE transactions 
       SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
       WHERE transaction_id = $${paramIndex} OR id = $${paramIndex}
       RETURNING *`,
      values
    );

    return parseStringify(result.rows[0]);
  } catch (error) {
    console.error("Error updating transaction in PostgreSQL:", error);
    throw error;
  }
};

// Delete transaction
export const deleteTransaction = async (transactionId: string) => {
  try {
    await query(`DELETE FROM transactions WHERE transaction_id = $1 OR id = $1`, [
      transactionId,
    ]);
    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction from PostgreSQL:", error);
    throw error;
  }
};

