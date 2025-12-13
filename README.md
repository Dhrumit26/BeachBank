# 🏦 BeachBank - Modern Banking Application

<div align="center">

**A full-stack banking application with real-time account management, transaction tracking, and secure payment transfers**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge)](https://beachbank.netlify.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

**🔗 Live Application:** [https://beachbank.netlify.app](https://beachbank.netlify.app)

</div>

---

## 📸 Screenshots

<img width="1507" height="826" alt="Screenshot 2025-12-13 at 2 50 26 PM" src="https://github.com/user-attachments/assets/4d2d5d63-3ae3-436b-87c5-e0f2aaeefd34" />
<img width="1512" height="829" alt="Screenshot 2025-12-13 at 2 51 22 PM" src="https://github.com/user-attachments/assets/a68739e4-b238-49fb-a662-f5e2c174569c" />
<img width="1512" height="830" alt="Screenshot 2025-12-13 at 2 51 33 PM" src="https://github.com/user-attachments/assets/b1d5f5cd-e8f4-4b67-9cba-2c0bc32cc81e" />
<img width="1512" height="827" alt="Screenshot 2025-12-13 at 2 53 03 PM" src="https://github.com/user-attachments/assets/bf0c59e1-5bd0-4d99-b8ac-d637f84e4073" />
<img width="1512" height="828" alt="Screenshot 2025-12-13 at 2 53 14 PM" src="https://github.com/user-attachments/assets/d40ea6c0-fa2a-47b4-96f9-bd73afaa5999" />
<img width="1013" height="791" alt="Screenshot 2025-12-13 at 2 53 24 PM" src="https://github.com/user-attachments/assets/17eacb26-836c-4d49-adf4-f1f7eb9b5154" />



## 🎯 Project Overview

BeachBank is a comprehensive banking application that enables users to connect their bank accounts, view real-time balances, track transactions, and transfer funds securely. Built with modern web technologies and integrated with industry-leading financial APIs, this application demonstrates full-stack development capabilities with a focus on security, performance, and user experience.

### Key Highlights

- ✅ **Real-time Bank Account Integration** via Plaid API
- ✅ **Secure Payment Transfers** using Dwolla payment infrastructure
- ✅ **Dual Database Architecture** (PostgreSQL primary, Appwrite fallback)
- ✅ **Server-Side Rendering** with Next.js 14 App Router
- ✅ **Type-Safe Development** with TypeScript
- ✅ **Automated CI/CD Pipeline** with GitHub Actions
- ✅ **Production Deployment** on Netlify

---

## 🚀 Live Demo

**🔗 Application URL:** [https://beachbank.netlify.app](https://beachbank.netlify.app)

**Test Credentials:**
- Sign up with any email to create a new account
- Use Plaid Sandbox credentials to connect test bank accounts
- All transactions and transfers are processed in sandbox mode

---

## ✨ Features

### 🔐 Authentication & User Management
- Secure user authentication with Appwrite
- Session management with HTTP-only cookies
- Protected routes and server-side authentication checks
- User profile management

### 🏦 Bank Account Management
- **Connect Multiple Banks**: Link bank accounts through Plaid Link integration
- **Real-time Balance Sync**: Automatic balance updates from connected accounts
- **Account Overview**: View all connected accounts with current and available balances
- **Account Details**: Detailed view of individual accounts with transaction history

### 💳 Transaction Management
- **Transaction History**: Complete transaction log with pagination
- **Transaction Filtering**: Filter by account, date range, and transaction type
- **Category Analysis**: Visual breakdown of spending by category (Doughnut chart)
- **Real-time Updates**: Transactions sync automatically from Plaid
- **Transfer Tracking**: Internal transfers between accounts are tracked separately

### 💸 Payment Transfers
- **Secure Transfers**: Send money between connected accounts using Dwolla
- **Funding Source Management**: Automatic funding source creation and management
- **Transfer History**: Complete audit trail of all transfers
- **Balance Validation**: Real-time balance checks before transfers

### 📊 Dashboard & Analytics
- **Total Balance Overview**: Aggregated balance across all accounts
- **Recent Transactions**: Quick view of latest transactions
- **Spending Categories**: Visual representation of spending patterns
- **Account Cards**: Beautiful card UI showing account details

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2.3 | React framework with App Router, Server Components, and Server Actions |
| **React** | 18.x | UI library for building interactive components |
| **TypeScript** | 5.x | Type-safe JavaScript for better code quality and developer experience |
| **Tailwind CSS** | 3.4.1 | Utility-first CSS framework for rapid UI development |
| **Chart.js** | 4.4.2 | Data visualization library for spending category charts |
| **React Hook Form** | 7.51.3 | Performant form library with validation |
| **Zod** | 3.23.4 | TypeScript-first schema validation |

### Backend & APIs
| Technology | Purpose |
|------------|---------|
| **Next.js API Routes** | Server-side API endpoints for backend logic |
| **Next.js Server Actions** | Type-safe server functions for data mutations |
| **Plaid API** | Bank account linking, transaction fetching, and balance retrieval |
| **Dwolla API** | Payment processing, customer management, and fund transfers |
| **Appwrite** | User authentication and database fallback |

### Database
| Technology | Purpose |
|------------|---------|
| **PostgreSQL** | Primary database for accounts and transactions (via Supabase) |
| **Appwrite Database** | Fallback database when PostgreSQL is unavailable |
| **Connection Pooling** | Efficient database connection management |

### DevOps & Deployment
| Technology | Purpose |
|------------|---------|
| **GitHub Actions** | CI/CD pipeline for automated testing and deployment |
| **Netlify** | Production hosting with automatic deployments |
| **Supabase** | Managed PostgreSQL database with connection pooling |
| **Environment Variables** | Secure configuration management |

### Development Tools
- **ESLint**: Code linting and quality checks
- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: Automatic vendor prefixing
- **TypeScript Compiler**: Type checking and compilation

---

## 🏗️ Architecture

### Application Structure

```
banking/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication routes
│   │   ├── sign-in/            # Sign in page
│   │   └── sign-up/            # Sign up page
│   ├── (root)/                  # Protected application routes
│   │   ├── page.tsx            # Home dashboard
│   │   ├── my-banks/           # Bank accounts page
│   │   ├── transaction-history/ # Transaction history page
│   │   └── payment-transfer/   # Payment transfer page
│   └── api/                     # API routes
│       └── test-postgres/      # Database connection test endpoint
├── components/                   # React components
│   ├── ui/                     # Reusable UI components (shadcn/ui)
│   ├── BankCard.tsx            # Bank account card component
│   ├── RecentTransactions.tsx  # Transaction list component
│   ├── PaymentTransferForm.tsx # Transfer form component
│   └── ...
├── lib/                         # Core libraries and utilities
│   ├── actions/                # Server Actions
│   │   ├── bank.actions.ts     # Bank account operations
│   │   ├── transaction.actions.ts # Transaction operations
│   │   ├── user.actions.ts     # User authentication
│   │   └── postgres.*.actions.ts # PostgreSQL CRUD operations
│   ├── appwrite.ts             # Appwrite client configuration
│   ├── plaid.ts                # Plaid API client
│   ├── postgres.ts             # PostgreSQL connection pool
│   └── utils.ts                # Utility functions
├── database/                    # Database scripts
│   ├── schema.sql              # PostgreSQL schema definition
│   ├── run-migration.js        # Migration script
│   └── verify-connection.js    # Connection test script
└── public/                      # Static assets
```

### Data Flow

1. **User Authentication**
   - User signs in → Appwrite validates credentials → Session cookie created
   - Protected routes check session on server-side before rendering

2. **Bank Account Connection**
   - User clicks "Connect Bank" → Plaid Link opens → User selects bank
   - Plaid returns public token → Server exchanges for access token
   - Account data fetched from Plaid → Stored in PostgreSQL/Appwrite

3. **Transaction Sync**
   - Server Actions fetch transactions from Plaid API
   - Transactions stored in PostgreSQL with proper indexing
   - Real-time balance updates calculated and stored

4. **Payment Transfer**
   - User initiates transfer → Balance validated → Dwolla customer created
   - Funding source linked via Plaid processor token
   - Transfer executed through Dwolla API
   - Transaction recorded in database

### Database Schema

**Accounts Table:**
- Stores bank account information, balances, and Plaid access tokens
- Indexed on `user_id`, `bank_id`, and `appwrite_item_id` for fast queries
- Automatic `updated_at` timestamp via triggers

**Transactions Table:**
- Stores all transactions (both Plaid and internal transfers)
- Indexed on `account_id`, `bank_id`, `date` for efficient filtering
- Supports both credit and debit transactions with category tracking

---

## 🔌 API Integrations

### Plaid Integration
**Purpose:** Bank account connectivity and financial data aggregation

**Key Features:**
- **Link Integration**: Secure OAuth-style bank connection flow
- **Account Information**: Retrieve account details, balances, and metadata
- **Transaction Sync**: Fetch historical and real-time transactions
- **Institution Data**: Get bank logos and information

**Implementation:**
- Server-side Plaid client with environment-based configuration
- Access token management for persistent bank connections
- Error handling and retry logic for API calls

### Dwolla Integration
**Purpose:** Payment processing and fund transfers

**Key Features:**
- **Customer Management**: Create and manage Dwolla customer records
- **Funding Sources**: Link bank accounts as funding sources via Plaid
- **On-Demand Authorization**: Secure authorization flow for transfers
- **Transfer Execution**: Process ACH transfers between accounts

**Implementation:**
- OAuth 2.0 authentication with Dwolla
- Processor token exchange from Plaid
- Comprehensive error handling for transfer failures

### Appwrite Integration
**Purpose:** User authentication and database fallback

**Key Features:**
- **User Authentication**: Email/password authentication
- **Session Management**: Secure session handling
- **Database Fallback**: Backup storage when PostgreSQL unavailable

---

## 🗄️ Database Design

### PostgreSQL (Primary Database)

**Connection Strategy:**
- Connection pooling for efficient resource management
- Lazy initialization to prevent build-time connection attempts
- SSL configuration for secure Supabase connections
- Automatic fallback to Appwrite if PostgreSQL unavailable

**Schema Highlights:**
- Normalized design with proper foreign key relationships
- Indexes on frequently queried columns
- Automatic timestamp updates via database triggers
- Support for both Plaid transactions and internal transfers

### Appwrite (Fallback Database)

**Use Case:**
- Backup storage when PostgreSQL connection fails
- User authentication data
- Graceful degradation for high availability

---

## 🚀 Deployment & CI/CD

### GitHub Actions Workflow

**CI Pipeline (`ci.yml`):**
- Runs on every push and pull request
- Installs dependencies with `npm ci`
- Runs ESLint for code quality
- Builds the project with all environment variables
- Uploads build artifacts for review

**CD Pipeline (`deploy-netlify.yml`):**
- Triggers on push to `main` branch
- Builds production-optimized Next.js application
- Deploys to Netlify with environment variables
- Automatic rollback on build failures

### Netlify Configuration

**Build Settings:**
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 20
- Next.js plugin for optimal performance

**Environment Variables:**
- All API keys and secrets stored securely
- Separate configurations for development and production
- Secrets scanning enabled for security

---

## 📦 Installation & Setup

### Prerequisites

- Node.js 20 or higher
- npm or yarn package manager
- PostgreSQL database (Supabase recommended)
- Appwrite instance
- Plaid account (sandbox or production)
- Dwolla account (sandbox or production)

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd banking
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Variables

Create a `.env.local` file in the root directory:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
NEXT_PUBLIC_APPWRITE_PROJECT=your_appwrite_project_id
NEXT_APPWRITE_KEY=your_appwrite_api_key
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_USER_COLLECTION_ID=your_user_collection_id
APPWRITE_BANK_COLLECTION_ID=your_bank_collection_id
APPWRITE_TRANSACTION_COLLECTION_ID=your_transaction_collection_id

# Plaid Configuration
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox

# Dwolla Configuration
DWOLLA_KEY=your_dwolla_key
DWOLLA_SECRET=your_dwolla_secret
DWOLLA_ENV=sandbox

# PostgreSQL Configuration
POSTGRES_URL=your_postgresql_connection_string

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 4: Database Setup

Run the PostgreSQL migration:

```bash
cd database
node run-migration.js
```

Or manually execute `database/schema.sql` in your PostgreSQL database.

### Step 5: Verify Database Connection

```bash
cd database
node verify-connection.js
```

### Step 6: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

### Database Connection Test

Visit `/api/test-postgres` to verify PostgreSQL connectivity:
- Tests database connection
- Verifies schema existence
- Checks table structure

### Manual Testing Checklist

- [ ] User sign up and sign in
- [ ] Connect bank account via Plaid
- [ ] View account balances
- [ ] View transaction history
- [ ] Filter transactions
- [ ] Initiate payment transfer
- [ ] View transfer history
- [ ] Category spending analysis

---

## 🔒 Security Features

- **Server-Side Authentication**: All authentication checks on server
- **HTTP-Only Cookies**: Secure session management
- **Environment Variables**: Sensitive data never exposed to client
- **SSL/TLS**: Encrypted database connections
- **Input Validation**: Zod schemas for all user inputs
- **SQL Injection Prevention**: Parameterized queries
- **Secrets Scanning**: Automated detection of exposed secrets

---

## 📈 Performance Optimizations

- **Server Components**: Reduced client-side JavaScript
- **Connection Pooling**: Efficient database connections
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: Strategic use of Next.js caching strategies

---

## 🎓 Key Learning Outcomes

### Technical Skills Demonstrated

1. **Full-Stack Development**
   - Built complete application from frontend to backend
   - Integrated multiple third-party APIs
   - Managed complex state and data flow

2. **Modern React/Next.js**
   - Server Components and Server Actions
   - App Router architecture
   - Type-safe development with TypeScript

3. **Database Management**
   - PostgreSQL schema design
   - Connection pooling and optimization
   - Migration strategies

4. **API Integration**
   - RESTful API consumption
   - OAuth and authentication flows
   - Error handling and retry logic

5. **DevOps & Deployment**
   - CI/CD pipeline setup
   - Environment configuration
   - Production deployment strategies

6. **Security Best Practices**
   - Secure authentication
   - Data encryption
   - Secrets management

---

## 🤝 Contributing

This is a personal project. For questions or suggestions, please open an issue.

---

## 📄 License

This project is private and proprietary.

---

## 👤 Author

**Dhrumit Savaliya**

- **Portfolio**: [Add your portfolio link]
- **LinkedIn**: [Add your LinkedIn profile]
- **Email**: [Add your email]

---

## 🙏 Acknowledgments

- **Plaid** for bank connectivity API
- **Dwolla** for payment processing infrastructure
- **Appwrite** for authentication services
- **Supabase** for managed PostgreSQL hosting
- **Next.js Team** for the amazing framework
- **Vercel/Netlify** for hosting infrastructure

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**

[🔗 Live Demo](https://beachbank.netlify.app) | [📖 Documentation](#) | [🐛 Report Bug](#)

</div>
