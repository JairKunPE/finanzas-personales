"use client";

import { useState } from "react";

import { CategoryCard, type CategoryCardDto } from "@/components/categories/category-card";
import { CategoryForm, type CategoryFormValues } from "@/components/categories/category-form";
import { DeleteCategoryDialog } from "@/components/categories/delete-category-dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { createCategory, removeCategory, updateCategory, useCategories, deleteCategoryWithReassign, deleteCategoryWithTransactions } from "@/lib/api/categories";

export default function CategoriesPage() {
  const { data: categories, error, isLoading, mutate } = useCategories();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<CategoryCardDto | null>(null);
  const [deleting, setDeleting] = useState<(CategoryCardDto & { transactionsCount: number }) | null>(null);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;

  async function handleCreate(values: CategoryFormValues) {
    await createCategory(values);
    setCreating(false);
    mutate();
  }

  async function handleEdit(values: CategoryFormValues) {
    if (!editing) return;
    await updateCategory(editing.id, values);
    setEditing(null);
    mutate();
  }

  async function handleReassign(targetId: number) {
    if (!deleting) return;
    await deleteCategoryWithReassign(deleting.id, targetId);
    setDeleting(null);
    mutate();
  }

  async function handleDeleteTransactions() {
    if (!deleting) return;
    await deleteCategoryWithTransactions(deleting.id);
    setDeleting(null);
    mutate();
  }

  async function confirmDelete(cat: CategoryCardDto) {
    const res = await fetch(`/api/categories/${cat.id}/transactions-count`);
    const count = res.ok ? await res.json() : 0;
    setDeleting({ ...cat, transactionsCount: count });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Categorias</h1>
          <p className="text-sm text-muted-foreground">Administra las categorias para tus transacciones</p>
        </div>
        <Button type="button" onClick={() => setCreating(true)}>Nueva categoria</Button>
      </div>

      {!categories || categories.length === 0 ? (
        <EmptyState title="Sin categorias" description="Crea tu primera categoria personalizada." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onEdit={() => setEditing(cat)}
              onDelete={() => confirmDelete(cat)}
            />
          ))}
        </div>
      )}

      {creating ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border bg-card p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold">Nueva categoria</h2>
            <CategoryForm onSave={handleCreate} onCancel={() => setCreating(false)} />
          </div>
        </div>
      ) : null}

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border bg-card p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold">Editar categoria</h2>
            <CategoryForm
              initial={{ name: editing.name, icon: editing.icon, color: editing.color }}
              onSave={handleEdit}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      ) : null}

      {deleting ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-xl">
            {deleting.transactionsCount > 0 ? (
              <DeleteCategoryDialog
                category={deleting}
                transactionsCount={deleting.transactionsCount}
                onReassign={handleReassign}
                onDeleteTransactions={handleDeleteTransactions}
                onCancel={() => setDeleting(null)}
              />
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">Eliminar categoria</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Estas seguro de eliminar <strong>{deleting.name}</strong>?
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="danger" onClick={async () => {
                    await removeCategory(deleting.id);
                    setDeleting(null);
                    mutate();
                  }}>Eliminar</Button>
                  <Button type="button" variant="secondary" onClick={() => setDeleting(null)}>Cancelar</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
