"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID,
} = process.env;

export const createTransaction = async (transaction: CreateTransactionProps) => {
  try {
    console.log('Creating transaction with data:', transaction);
    console.log('Database ID:', DATABASE_ID);
    console.log('Transaction Collection ID:', TRANSACTION_COLLECTION_ID);
    
    if (!DATABASE_ID || !TRANSACTION_COLLECTION_ID) {
      console.error('Missing database or collection ID environment variables');
      throw new Error('Database configuration is missing');
    }

    const { database } = await createAdminClient();

    // Validate and convert input data
    const senderId = transaction.senderId;
    const receiverId = transaction.receiverId;
    
    console.log('Raw transaction data:', {
      senderId,
      receiverId,
      senderIdType: typeof senderId,
      receiverIdType: typeof receiverId,
      senderIdValue: senderId,
      receiverIdValue: receiverId
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

    // Validate string length (Appwrite limit is 1000 chars)
    if (senderIdStr.length === 0 || senderIdStr.length > 1000) {
      throw new Error(`Invalid senderId: must be between 1 and 1000 characters. Length: ${senderIdStr.length}`);
    }
    
    if (receiverIdStr.length === 0 || receiverIdStr.length > 1000) {
      throw new Error(`Invalid receiverId: must be between 1 and 1000 characters. Length: ${receiverIdStr.length}`);
    }

    // Validate and format amount as string (database requires string, max 100 chars)
    const amountStr = String(transaction.amount || '0').trim();
    const amountNum = parseFloat(amountStr);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      throw new Error('Invalid transaction amount');
    }
    
    // Format amount as string with 2 decimal places, max 100 chars
    const formattedAmount = amountNum.toFixed(2);
    if (formattedAmount.length > 100) {
      throw new Error(`Transaction amount is too long (max 100 characters). Length: ${formattedAmount.length}`);
    }

    // Ensure all fields are valid strings
    const transactionData = {
      channel: 'online',
      category: 'Transfer',
      name: String(transaction.name || '').trim(),
      amount: formattedAmount, // Keep as string (database requirement)
      senderId: senderIdStr, // Validated string
      senderBankId: String(transaction.senderBankId || '').trim(),
      receiverId: receiverIdStr, // Validated string
      receiverBankId: String(transaction.receiverBankId || '').trim(),
      email: String(transaction.email || '').trim(),
    };

    // Validate other required fields
    if (!transactionData.senderBankId || !transactionData.receiverBankId) {
      throw new Error('Missing required transaction fields: senderBankId or receiverBankId');
    }

    console.log('Transaction data to save:', transactionData);

    const newTransaction = await database.createDocument(
      DATABASE_ID,
      TRANSACTION_COLLECTION_ID,
      ID.unique(),
      transactionData
    )

    console.log('Transaction created successfully:', newTransaction.$id);
    return parseStringify(newTransaction);
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    // Re-throw error so caller can handle it
    throw new Error(`Failed to create transaction record: ${error?.message || 'Unknown error'}`);
  }
}

export const getTransactionsByBankId = async ({bankId}: getTransactionsByBankIdProps) => {
  try {
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

    console.log(`Found ${transactions.total} transfer transactions for bank ${bankId}`);
    return parseStringify(transactions);
  } catch (error) {
    console.error('Error getting transactions by bank ID:', error);
    return { total: 0, documents: [] };
  }
}