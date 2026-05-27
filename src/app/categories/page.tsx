import { PageHeader } from "@/components/ui/page-header";
import { CategoryGrid } from "@/components/categories/category-grid";

export default function CategoriesPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Categorias" showBack />
      <CategoryGrid />
    </div>
  );
}
