export function ErrorState({ message = "No se pudo cargar la informacion." }: { message?: string }) {
  return <div className="rounded-2xl border border-expense/40 bg-expense/10 p-5 text-sm text-expense">{message}</div>;
}
