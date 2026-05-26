"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { CategoryGrid } from "@/components/categories/category-grid";

export default function CategoriesPage() {
  const router = useRouter();

  return (
    <div className="space-y-5">
      <div className="relative flex items-center justify-center">
        <button
          onClick={() => router.back()}
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
          aria-label="Atras"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-bold">Categorias</h2>
      </div>

      <CategoryGrid />
    </div>
  );
}
