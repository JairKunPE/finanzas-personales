export function LoadingState({ label = "Cargando..." }: { label?: string }) {
  return <div className="rounded-2xl border bg-card p-5 text-sm text-muted-foreground">{label}</div>;
}
