import { cn } from "@/lib/utils";

type BadgeProps = {
  variant?: "primary" | "secondary";
  className?: string;
  children: React.ReactNode;
};

export function Badge({ variant = "primary", className, children }: BadgeProps) {
  const variants = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-muted text-muted-foreground",
  };
  return (
    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
}
