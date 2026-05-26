import { listTransactions } from "@/lib/db/transactions";
import { TransactionListView } from "@/components/transactions/transaction-list-view";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const data = await listTransactions({ page: 1, pageSize: 1000 });

  return (
    <div className="space-y-4">
      <h2 className="text-center text-lg font-bold">Movimientos</h2>
      <TransactionListView transactions={data.items} />
    </div>
  );
}
