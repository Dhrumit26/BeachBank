// import HeaderBox from '@/components/HeaderBox'
// import { Pagination } from '@/components/Pagination';
// import TransactionsTable from '@/components/TransactionsTable';
// import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
// import { getLoggedInUser } from '@/lib/actions/user.actions';
// import { formatAmount } from '@/lib/utils';
// import React from 'react'

// const TransactionHistory = async ({ searchParams: { id, page }}:SearchParamProps) => {
//   const currentPage = Number(page as string) || 1;
//   const loggedIn = await getLoggedInUser();
//   const accounts = await getAccounts({ 
//     userId: loggedIn.$id 
//   })

//   if(!accounts) return;
  
//   const accountsData = accounts?.data;
//   const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

//   const account = await getAccount({ appwriteItemId })


// const rowsPerPage = 10;
// const totalPages = Math.ceil(account?.transactions.length / rowsPerPage);

// const indexOfLastTransaction = currentPage * rowsPerPage;
// const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

// const currentTransactions = account?.transactions.slice(
//   indexOfFirstTransaction, indexOfLastTransaction
// )
//   return (
//     <div className="transactions">
//       <div className="transactions-header">
//         <HeaderBox 
//           title="Transaction History"
//           subtext="See your bank details and transactions."
//         />
//       </div>

//       <div className="space-y-6">
//         <div className="transactions-account">
//           <div className="flex flex-col gap-2">
//             <h2 className="text-18 font-bold text-white">{account?.data.name}</h2>
//             <p className="text-14 text-blue-25">
//               {account?.data.officialName}
//             </p>
//             <p className="text-14 font-semibold tracking-[1.1px] text-white">
//               ●●●● ●●●● ●●●● {account?.data.mask}
//             </p>
//           </div>
          
//           <div className='transactions-account-balance'>
//             <p className="text-14">Current balance</p>
//             <p className="text-24 text-center font-bold">{formatAmount(account?.data.currentBalance)}</p>
//           </div>
//         </div>

//         <section className="flex w-full flex-col gap-6">
//           <TransactionsTable 
//             transactions={currentTransactions}
//           />
//             {totalPages > 1 && (
//               <div className="my-4 w-full">
//                 <Pagination totalPages={totalPages} page={currentPage} />
//               </div>
//             )}
//         </section>
//       </div>
//     </div>
//   )
// }

// export default TransactionHistory


import HeaderBox from "@/components/HeaderBox"
import { Pagination } from "@/components/Pagination"
import TransactionsTable from "@/components/TransactionsTable"
import { getAccount, getAccounts } from "@/lib/actions/bank.actions"
import { getLoggedInUser } from "@/lib/actions/user.actions"
import { formatAmount } from "@/lib/utils"
import React from "react"

const TransactionHistory = async ({
  searchParams: { id, page },
}: SearchParamProps) => {
  const currentPage = Number(page as string) || 1

  const loggedIn = await getLoggedInUser()
  
  if(!loggedIn) {
    return null;
  }

  const accounts = await getAccounts({
    userId: loggedIn.$id,
  })

  if (!accounts) return null

  const accountsData = accounts.data ?? []
  const appwriteItemId =
    (id as string) || accountsData[0]?.appwriteItemId || ""

  // Try to fetch the real account if we have an id
  const account = appwriteItemId
    ? await getAccount({ appwriteItemId })
    : null

  // ------------------------------
  // Use real transaction data from account
  // ------------------------------
  const realTransactions: Transaction[] = (account?.transactions || []).map((tx: any) => ({
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
  }))

  // Keep dummy transactions as fallback (commented out for now)
  const dummyTransactions: Transaction[] = [
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
    amount: 25,
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
  {
    id: "tx_017",
    $id: "tx_017",
    name: "Bakery",
    paymentChannel: "in_store",
    type: "debit",
    accountId: "acc_001",
    amount: 10,
    pending: false,
    category: "Food & Drink",
    date: "2025-01-14",
    image: "/images/placeholder.png",
    $createdAt: "2025-01-14T08:00:00.000Z",
    channel: "card",
    senderBankId: "bank_001",
    receiverBankId: "bakery",
  },
  {
    id: "tx_018",
    $id: "tx_018",
    name: "Parking",
    paymentChannel: "in_store",
    type: "debit",
    accountId: "acc_001",
    amount: 10,
    pending: false,
    category: "Transport",
    date: "2025-01-14",
    image: "/images/placeholder.png",
    $createdAt: "2025-01-14T18:10:00.000Z",
    channel: "card",
    senderBankId: "bank_001",
    receiverBankId: "parking_lot",
  },
  {
    id: "tx_019",
    $id: "tx_019",
    name: "Tech Accessories",
    paymentChannel: "online",
    type: "debit",
    accountId: "acc_001",
    amount: 45,
    pending: false,
    category: "Shopping",
    date: "2025-01-15",
    image: "/images/placeholder.png",
    $createdAt: "2025-01-15T14:00:00.000Z",
    channel: "card",
    senderBankId: "bank_001",
    receiverBankId: "store_004",
  },
  {
    id: "tx_020",
    $id: "tx_020",
    name: "Cash Gift",
    paymentChannel: "branch",
    type: "credit",
    accountId: "acc_001",
    amount: 25,
    pending: false,
    category: "Income",
    date: "2025-01-16",
    image: "/images/placeholder.png",
    $createdAt: "2025-01-16T10:30:00.000Z",
    channel: "cash",
    senderBankId: "friend_bank_2",
    receiverBankId: "bank_001",
  },
]


  // ------------------------------
  // Combine dummy + real transactions and sort by date
  // ------------------------------
  const allTransactions = [...dummyTransactions, ...realTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // ------------------------------
  // ✅ Safe account data for the header
  //    (use real data if present, otherwise dummy)
  // ------------------------------
  const safeAccountData = account?.data ?? {
    name: "BeachBank Checking",
    officialName: "BeachBank Demo Account",
    mask: "1234",
    currentBalance: allTransactions.reduce((sum, t) => {
      if (t.type === "credit") return sum + t.amount
      if (t.type === "debit") return sum - t.amount
      return sum
    }, 0),
  }

  // ------------------------------
  // ✅ Pagination over allTransactions
  // ------------------------------
  const rowsPerPage = 10
  const totalPages = Math.max(
    1,
    Math.ceil(allTransactions.length / rowsPerPage)
  )

  const indexOfLastTransaction = currentPage * rowsPerPage
  const indexOfFirstTransaction =
    indexOfLastTransaction - rowsPerPage

  const currentTransactions = allTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  )

  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox
          title="Transaction History"
          subtext="See your bank details and transactions."
        />
      </div>

      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">
              {safeAccountData.name}
            </h2>
            <p className="text-14 text-blue-25">
              {safeAccountData.officialName}
            </p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● {safeAccountData.mask}
            </p>
          </div>

          <div className="transactions-account-balance">
            <p className="text-14">Current balance</p>
            <p className="text-24 text-center font-bold">
              {formatAmount(safeAccountData.currentBalance)}
            </p>
          </div>
        </div>

        <section className="flex w-full flex-col gap-6">
          <TransactionsTable transactions={currentTransactions} />

          {totalPages > 1 && (
            <div className="my-4 w-full">
              <Pagination
                totalPages={totalPages}
                page={currentPage}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default TransactionHistory
