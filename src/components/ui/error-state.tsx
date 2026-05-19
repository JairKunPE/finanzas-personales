import { Button } from "@/components/ui/button";

export function ErrorState({
  message = "No se pudo cargar la informacion.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-expense/40 bg-expense/10 p-5 text-sm text-expense">
      <p>{message}</p>
      {onRetry ? (
        <Button type="button" variant="secondary" className="mt-3" onClick={onRetry}>
          Reintentar
        </Button>
      ) : null}
    </div>
  );
}
