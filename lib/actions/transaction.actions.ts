"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { createTransaction as createPostgresTransaction } from "./postgres.transactions.actions";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID,
} = process.env;

// Use PostgreSQL for transactions (primary), with Appwrite as fallback
export const createTransaction = async (transaction: CreateTransactionProps) => {
  try {
    console.log('Creating transaction with data:', transaction);

    // Validate and convert input data
    const senderId = transaction.senderId;
    const receiverId = transaction.receiverId;
    
    console.log('Raw transaction data:', {
      senderId,
      receiverId,
      senderIdType: typeof senderId,
      receiverIdType: typeof receiverId,
    });

    // Ensure senderId and receiverId are valid strings
    if (!senderId || (typeof senderId !== 'string' && typeof senderId !== 'number')) {
      throw new Error(`Invalid senderId: must be a non-empty string. Received: ${senderId} (type: ${typeof senderId})`);
    }
    
    if (!receiverId || (typeof receiverId !== 'string' && typeof receiverId !== 'number')) {
      throw new Error(`Invalid receiverId: must be a non-empty string. Received: ${receiverId} (type: ${typeof receiverId})`);
    }

    const senderIdStr = String(senderId).trim();
    const receiverIdStr = String(receiverId).trim();

    // Validate string length
    if (senderIdStr.length === 0) {
      throw new Error(`Invalid senderId: must not be empty`);
    }
    
    if (receiverIdStr.length === 0) {
      throw new Error(`Invalid receiverId: must not be empty`);
    }

    // Validate and format amount
    const amountStr = String(transaction.amount || '0').trim();
    const amountNum = parseFloat(amountStr);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      throw new Error('Invalid transaction amount');
    }

    // Validate other required fields
    if (!transaction.senderBankId || !transaction.receiverBankId) {
      throw new Error('Missing required transaction fields: senderBankId or receiverBankId');
    }

    // Try PostgreSQL first
    try {
      const postgresTransaction = await createPostgresTransaction({
        senderId: senderIdStr,
        receiverId: receiverIdStr,
        senderBankId: transaction.senderBankId,
        receiverBankId: transaction.receiverBankId,
        name: String(transaction.name || '').trim(),
        amount: amountNum,
        type: 'debit', // Transfer is a debit for sender
        category: 'Transfer',
        channel: 'online',
        paymentChannel: 'online',
        pending: false,
        date: new Date().toISOString().split('T')[0],
        email: String(transaction.email || '').trim(),
      });

      console.log('Transaction created successfully in PostgreSQL:', postgresTransaction.id);
      return parseStringify(postgresTransaction);
    } catch (postgresError) {
      console.warn('PostgreSQL transaction creation failed, falling back to Appwrite:', postgresError);
      
      // Fallback to Appwrite if PostgreSQL fails
      if (!DATABASE_ID || !TRANSACTION_COLLECTION_ID) {
        throw new Error('Database configuration is missing');
      }

      const { database } = await createAdminClient();
      const formattedAmount = amountNum.toFixed(2);

      const transactionData = {
        channel: 'online',
        category: 'Transfer',
        name: String(transaction.name || '').trim(),
        amount: formattedAmount,
        senderId: senderIdStr,
        senderBankId: String(transaction.senderBankId || '').trim(),
        receiverId: receiverIdStr,
        receiverBankId: String(transaction.receiverBankId || '').trim(),
        email: String(transaction.email || '').trim(),
      };

      const newTransaction = await database.createDocument(
        DATABASE_ID,
        TRANSACTION_COLLECTION_ID,
        ID.unique(),
        transactionData
      );

      console.log('Transaction created successfully in Appwrite:', newTransaction.$id);
      return parseStringify(newTransaction);
    }
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw new Error(`Failed to create transaction record: ${error?.message || 'Unknown error'}`);
  }
}

export const getTransactionsByBankId = async ({bankId}: getTransactionsByBankIdProps) => {
  try {
    // Try PostgreSQL first
    try {
      const { getTransactionsByBankId: getPostgresTransactions } = await import("./postgres.transactions.actions");
      const postgresTransactions = await getPostgresTransactions(bankId);
      
      if (postgresTransactions && postgresTransactions.total > 0) {
        console.log(`Found ${postgresTransactions.total} transfer transactions in PostgreSQL for bank ${bankId}`);
        return parseStringify(postgresTransactions);
      }
    } catch (postgresError) {
      console.warn('PostgreSQL query failed, falling back to Appwrite:', postgresError);
    }

    // Fallback to Appwrite
    const { database } = await createAdminClient();

    if (!DATABASE_ID || !TRANSACTION_COLLECTION_ID) {
      console.error('Missing database or collection ID environment variables');
      return { total: 0, documents: [] };
    }

    const senderTransactions = await database.listDocuments(
      DATABASE_ID,
      TRANSACTION_COLLECTION_ID,
      [Query.equal('senderBankId', bankId)],
    )

    const receiverTransactions = await database.listDocuments(
      DATABASE_ID,
      TRANSACTION_COLLECTION_ID,
      [Query.equal('receiverBankId', bankId)],
    );

    const transactions = {
      total: (senderTransactions?.total || 0) + (receiverTransactions?.total || 0),
      documents: [
        ...(senderTransactions?.documents || []), 
        ...(receiverTransactions?.documents || []),
      ]
    }

    console.log(`Found ${transactions.total} transfer transactions in Appwrite for bank ${bankId}`);
    return parseStringify(transactions);
  } catch (error) {
    console.error('Error getting transactions by bank ID:', error);
    return { total: 0, documents: [] };
  }
}