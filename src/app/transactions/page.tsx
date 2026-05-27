import { listTransactions } from "@/lib/db/transactions";
import { TransactionListView } from "@/components/transactions/transaction-list-view";

export const revalidate = 60;

export default async function TransactionsPage() {
  const data = await listTransactions({ page: 1, pageSize: 1000 });

  return (
    <div className="space-y-5">
      <TransactionListView transactions={data.items} />
    </div>
  );
}
