import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { countTransactionCategories } from '@/lib/utils';

// Dummy transactions for categories (same as in RecentTransactions)
const dummyTransactionsForCategories: Transaction[] = [
  {
    id: "tx_001",
    $id: "tx_001",
    name: "Initial Deposit",
    paymentChannel: "branch",
    type: "credit",
    accountId: "acc_001",
    amount: 200,
    pending: false,
    category: "Income",
    date: "2025-01-01",
    image: "/images/placeholder.png",
    $createdAt: "2025-01-01T09:00:00.000Z",
    channel: "cash",
    senderBankId: "employer_bank",
    receiverBankId: "bank_001",
  },
  {
    id: "tx_002",
    $id: "tx_002",
    name: "Groceries",
    paymentChannel: "in_store",
    type: "debit",
    accountId: "acc_001",
    amount: 40,
    pending: false,
    category: "Groceries",
    date: "2025-01-02",
    image: "/images/placeholder.png",
    $createdAt: "2025-01-02T12:00:00.000Z",
    channel: "card",
    senderBankId: "bank_001",
    receiverBankId: "store_001",
  },
  {
    id: "tx_003",
    $id: "tx_003",
    name: "Restaurant",
    paymentChannel: "in_store",
    type: "debit",
    accountId: "acc_001",
    amount: 35,
    pending: false,
    category: "Food & Drink",
    date: "2025-01-03",
    image: "/images/placeholder.png",
    $createdAt: "2025-01-03T19:30:00.000Z",
    channel: "card",
    senderBankId: "bank_001",
    receiverBankId: "restaurant_001",
  },
  {
    id: "tx_004",
    $id: "tx_004",
    name: "Freelance Payment",
    paymentChannel: "online",
    type: "credit",
    accountId: "acc_001",
    amount: 150,
    pending: false,
    category: "Income",
    date: "2025-01-04",
    image: "/images/placeholder.png",
    $createdAt: "2025-01-04T15:00:00.000Z",
    channel: "ach",
    senderBankId: "client_bank",
    receiverBankId: "bank_001",
  },
  {
    id: "tx_005",
    $id: "tx_005",
    name: "Gas Station",
    paymentChannel: "in_store",
    type: "debit",
    accountId: "acc_001",
    amount: 30,
    pending: false,
    category: "Transport",
    date: "2025-01-05",
    image: "/images/placeholder.png",
    $createdAt: "2025-01-05T11:00:00.000Z",
    channel: "card",
    senderBankId: "bank_001",
    receiverBankId: "gas_001",
  },
  {
    id: "tx_006",
    $id: "tx_006",
    name: "Coffee Shop",
    paymentChannel: "in_store",
    type: "debit",
    accountId: "acc_001",
    amount: 15,
    pending: false,
    category: "Food & Drink",
    date: "2025-01-06",
    image: "/images/placeholder.png",
    $createdAt: "2025-01-06T08:30:00.000Z",
    channel: "card",
    senderBankId: "bank_001",
    receiverBankId: "coffee_001",
  },
  {
    id: "tx_007",
    $id: "tx_007",
    name: "Bus Pass",
    paymentChannel: "online",
    type: "debit",
    accountId: "acc_001",
    amount: 20,
    pending: false,
    category: "Transport",
    date: "2025-01-07",
    image: "/images/placeholder.png",
    $createdAt: "2025-01-07T07:15:00.000Z",
    channel: "card",
    senderBankId: "bank_001",
    receiverBankId: "transit_001",
  },
  {
    id: "tx_008",
    $id: "tx_008",
    name: "Snacks",
    paymentChannel: "in_store",
    type: "debit",
    accountId: "acc_001",
    amount: 20,
    pending: false,
    category: "Groceries",
    date: "2025-01-07",
    image: "/images/placeholder.png",
    $createdAt: "2025-01-07T18:45:00.000Z",
    channel: "card",
    senderBankId: "bank_001",
    receiverBankId: "store_002",
  },
  {
    id: "tx_009",
    $id: "tx_009",
    name: "Part-time Job",
    paymentChannel: "direct_deposit",
    type: "credit",
    accountId: "acc_001",
    amount: 75,
    pending: false,
    category: "Income",
    date: "2025-01-08",
    image: "/images/placeholder.png",
    $createdAt: "2025-01-08T09:00:00.000Z",
    channel: "ach",
    senderBankId: "employer_bank_2",
    receiverBankId: "bank_001",
  },
  {
    id: "tx_010",
    $id: "tx_010",
    name: "Uber",
    paymentChannel: "online",
    type: "debit",
    accountId: "acc_001",
    amount: 15,
    pending: false,
    category: "Transport",
    date: "2025-01-08",
    image: "/images/placeholder.png",
    $createdAt: "2025-01-08T22:10:00.000Z",
    channel: "card",
    senderBankId: "bank_001",
    receiverBankId: "uber",
  },
  {
    id: "tx_011",
    $id: "tx_011",
    name: "Ice Cream",
    paymentChannel: "in_store",
    type: "debit",
    accountId: "acc_001",
    amount: 15,
    pending: false,
    category: "Food & Drink",
    date: "2025-01-09",
    image: "/images/placeholder.png",
    $createdAt: "2025-01-09T17:30:00.000Z",
    channel: "card",
    senderBankId: "bank_001",
    receiverBankId: "dessert_shop",
  },
  {
    id: "tx_012",
    $id: "tx_012",
    name: "Streaming Service",
    paymentChannel: "online",
    type: "debit",
    accountId: "acc_001",
    amount: 30,
    pending: false,
    category: "Entertainment",
    date: "2025-01-10",
    image: "/images/placeholder.png",
    $createdAt: "2025-01-10T06:00:00.000Z",
    channel: "card",
    senderBankId: "bank_001",
    receiverBankId: "stream_001",
  },
  {
    id: "tx_013",
    $id: "tx_013",
    name: "Lunch Out",
    paymentChannel: "in_store",
    type: "debit",
    accountId: "acc_001",
    amount: 25,
    pending: false,
    category: "Food & Drink",
    date: "2025-01-11",
    image: "/images/placeholder.png",
    $createdAt: "2025-01-11T12:30:00.000Z",
    channel: "card",
    senderBankId: "bank_001",
    receiverBankId: "restaurant_002",
  },
  {
    id: "tx_014",
    $id: "tx_014",
    name: "Gift Received",
    paymentChannel: "online",
    type: "credit",
    accountId: "acc_001",
    amount: 50,
    pending: false,
    category: "Income",
    date: "2025-01-12",
    image: "/images/placeholder.png",
    $createdAt: "2025-01-12T09:45:00.000Z",
    channel: "transfer",
    senderBankId: "friend_bank",
    receiverBankId: "bank_001",
  },
  {
    id: "tx_015",
    $id: "tx_015",
    name: "Clothes Shopping",
    paymentChannel: "in_store",
    type: "debit",
    accountId: "acc_001",
    amount: 40,
    pending: false,
    category: "Shopping",
    date: "2025-01-12",
    image: "/images/placeholder.png",
    $createdAt: "2025-01-12T16:00:00.000Z",
    channel: "card",
    senderBankId: "bank_001",
    receiverBankId: "store_003",
  },
  {
    id: "tx_016",
    $id: "tx_016",
    name: "Cinema",
    paymentChannel: "in_store",
    type: "debit",
    accountId: "acc_001",
    amount: 30,
    pending: false,
    category: "Entertainment",
    date: "2025-01-13",
    image: "/images/placeholder.png",
    $createdAt: "2025-01-13T20:00:00.000Z",
    channel: "card",
    senderBankId: "bank_001",
    receiverBankId: "cinema",
  },
];

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  
  try {
    const loggedIn = await getLoggedInUser();
    
    if(!loggedIn) {
      return null;
    }

    const accounts = await getAccounts({ 
      userId: loggedIn.$id 
    })

    if(!accounts) return null;
    
    const accountsData = accounts?.data || [];
    const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

    if (!appwriteItemId) {
      return null;
    }

    const account = await getAccount({ appwriteItemId })

  // Combine real transactions with dummy transactions for categories
  const realTransactions = (account?.transactions || []).map((tx: any) => ({
    id: tx.id || tx.$id || '',
    $id: tx.$id || tx.id || '',
    name: tx.name || 'Unknown Transaction',
    paymentChannel: tx.paymentChannel || tx.channel || 'online',
    type: tx.type || 'debit',
    accountId: tx.accountId || '',
    amount: typeof tx.amount === 'string' ? parseFloat(tx.amount) : (tx.amount || 0),
    pending: tx.pending || false,
    category: tx.category || 'Transfer',
    date: tx.date || tx.$createdAt || new Date().toISOString(),
    image: tx.image || '/images/placeholder.png',
    $createdAt: tx.$createdAt || tx.date || new Date().toISOString(),
    channel: tx.channel || tx.paymentChannel || 'online',
    senderBankId: tx.senderBankId || '',
    receiverBankId: tx.receiverBankId || '',
  }));

  const allTransactionsForCategories = [...dummyTransactionsForCategories, ...realTransactions];

  // Calculate categories for the donut chart
  const categories = countTransactionCategories(allTransactionsForCategories);

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox 
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox 
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
            categories={categories}
          />
        </header>

        <RecentTransactions 
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>

      <RightSidebar 
        user={loggedIn}
        transactions={allTransactionsForCategories}
        banks={accountsData?.slice(0, 2)}
      />
    </section>
  )
  } catch (error) {
    console.error('Error loading home page:', error);
    // Return a basic error state during build, or redirect in runtime
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return null;
    }
    throw error;
  }
}

export default Home