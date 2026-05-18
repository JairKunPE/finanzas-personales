import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionForm } from "@/components/transactions/transaction-form";

export default function NewTransactionPage() {
  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Nueva transaccion</CardTitle>
        <p className="text-sm text-muted-foreground">La fecha se completa con el dia actual por defecto.</p>
      </CardHeader>
      <TransactionForm />
    </Card>
  );
}
