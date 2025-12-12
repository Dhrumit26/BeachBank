-- PostgreSQL Schema for Banking Application
-- Run this SQL script to create the necessary tables

-- Accounts table (stores bank account information)
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    account_id VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    bank_id VARCHAR(255) NOT NULL,
    appwrite_item_id VARCHAR(255) UNIQUE NOT NULL,
    shareable_id VARCHAR(255) UNIQUE NOT NULL,
    institution_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    official_name VARCHAR(255),
    mask VARCHAR(10),
    type VARCHAR(50),
    subtype VARCHAR(50),
    available_balance DECIMAL(15, 2) DEFAULT 0,
    current_balance DECIMAL(15, 2) DEFAULT 0,
    access_token TEXT NOT NULL,
    funding_source_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table (stores all transactions including transfers)
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(255) UNIQUE,
    account_id VARCHAR(255) NOT NULL,
    bank_id VARCHAR(255),
    sender_id VARCHAR(255),
    receiver_id VARCHAR(255),
    sender_bank_id VARCHAR(255),
    receiver_bank_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'credit' or 'debit'
    category VARCHAR(100),
    channel VARCHAR(50),
    payment_channel VARCHAR(50),
    pending BOOLEAN DEFAULT false,
    date DATE NOT NULL,
    image_url TEXT,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_bank_id ON accounts(bank_id);
CREATE INDEX IF NOT EXISTS idx_accounts_appwrite_item_id ON accounts(appwrite_item_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_bank_id ON transactions(bank_id);
CREATE INDEX IF NOT EXISTS idx_transactions_sender_bank_id ON transactions(sender_bank_id);
CREATE INDEX IF NOT EXISTS idx_transactions_receiver_bank_id ON transactions(receiver_bank_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

