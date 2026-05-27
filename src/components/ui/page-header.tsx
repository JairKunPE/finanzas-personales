"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type PageHeaderProps = {
  title: string;
  showBack?: boolean;
};

export function PageHeader({ title, showBack }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="relative flex items-center justify-center">
      {showBack && (
        <button
          onClick={() => router.back()}
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
          aria-label="Atras"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <h2 className="text-lg font-bold">{title}</h2>
    </div>
  );
}
