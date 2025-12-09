// import Link from 'next/link'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { BankTabItem } from './BankTabItem'
// import BankInfo from './BankInfo'
// import TransactionsTable from './TransactionsTable'
// import { Pagination } from './Pagination'

// const RecentTransactions = ({
//   accounts,
//   transactions = [],
//   appwriteItemId,
//   page = 1,
// }: RecentTransactionsProps) => {
//   const rowsPerPage = 10;
//   const totalPages = Math.ceil(transactions.length / rowsPerPage);

//   const indexOfLastTransaction = page * rowsPerPage;
//   const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

//   const currentTransactions = transactions.slice(
//     indexOfFirstTransaction, indexOfLastTransaction
//   )

//   return (
//     <section className="recent-transactions">
//       <header className="flex items-center justify-between">
//         <h2 className="recent-transactions-label">Recent transactions</h2>
//         <Link
//           href={`/transaction-history/?id=${appwriteItemId}`}
//           className="view-all-btn"
//         >
//           View all
//         </Link>
//       </header>

//       <Tabs defaultValue={appwriteItemId} className="w-full">
//       <TabsList className="recent-transactions-tablist">
//           {accounts.map((account: Account) => (
//             <TabsTrigger key={account.id} value={account.appwriteItemId}>
//               <BankTabItem
//                 key={account.id}
//                 account={account}
//                 appwriteItemId={appwriteItemId}
//               />
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         {accounts.map((account: Account) => (
//           <TabsContent
//             value={account.appwriteItemId}
//             key={account.id}
//             className="space-y-4"
//           >
//             <BankInfo 
//               account={account}
//               appwriteItemId={appwriteItemId}
//               type="full"
//             />

//             <TransactionsTable transactions={currentTransactions} />
            

//             {totalPages > 1 && (
//               <div className="my-4 w-full">
//                 <Pagination totalPages={totalPages} page={page} />
//               </div>
//             )}
//           </TabsContent>
//         ))}
//       </Tabs>
//     </section>
//   )
// }

// export default RecentTransactions

"use client"

import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BankTabItem } from "./BankTabItem"
import BankInfo from "./BankInfo"
import TransactionsTable from "./TransactionsTable"
import { Pagination } from "./Pagination"

const RecentTransactions = ({
  accounts = [],
  transactions = [],
  appwriteItemId,
  page = 1,
}: RecentTransactionsProps) => {

  // -------------------------------------------
  // Dummy transactions for demo purposes
  // -------------------------------------------
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
  ]

  // -------------------------------------------
  // Transform real transactions from props
  // -------------------------------------------
  const transformedTransactions: Transaction[] = (transactions || []).map((tx: any) => ({
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

  // -------------------------------------------
  // Combine dummy + real transactions and sort by date
  // -------------------------------------------
  const allTransactions = [...dummyTransactions, ...transformedTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const rowsPerPage = 10
  const totalPages = Math.ceil(allTransactions.length / rowsPerPage)

  const indexOfLast = page * rowsPerPage
  const indexOfFirst = indexOfLast - rowsPerPage

  const currentTransactions = allTransactions.slice(indexOfFirst, indexOfLast)

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent transactions</h2>
        <Link
          href={`/transaction-history/?id=${appwriteItemId}`}
          className="view-all-btn"
        >
          View all
        </Link>
      </header>

      <Tabs defaultValue={appwriteItemId} className="w-full">
        <TabsList className="recent-transactions-tablist">
          {accounts.map((account: Account) => (
            <TabsTrigger key={account.id} value={account.appwriteItemId}>
              <BankTabItem
                account={account}
                appwriteItemId={appwriteItemId}
              />
            </TabsTrigger>
          ))}
        </TabsList>

        {accounts.map((account: Account) => (
          <TabsContent
            key={account.id}
            value={account.appwriteItemId}
            className="space-y-4"
          >
            <BankInfo 
              account={account}
              appwriteItemId={appwriteItemId}
              type="full"
            />

            <TransactionsTable transactions={currentTransactions} />

            {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} page={page} />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}

export default RecentTransactions
