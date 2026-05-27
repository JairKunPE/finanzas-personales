"use client";

import { useState } from "react";
import { toast } from "sonner";
import { iconMap, CircleEllipsis, Plus, Search } from "@/lib/finance/icon-map";

import { CategoryForm, type CategoryFormValues } from "@/components/categories/category-form";
import { DeleteCategoryDialog } from "@/components/categories/delete-category-dialog";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import {
  createCategory,
  removeCategory,
  updateCategory,
  useCategories,
  deleteCategoryWithReassign,
  deleteCategoryWithTransactions,
} from "@/lib/api/categories";

type ModalMode = "create" | "edit" | "delete" | null;

export function CategoryGrid() {
  const { data: categories, error, isLoading, mutate } = useCategories();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<{ id: number; name: string; icon: string; color: string; isDefault: boolean } | null>(null);
  const [deleteCount, setDeleteCount] = useState(0);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} onRetry={() => mutate()} />;

  const filtered = categories?.filter((c) => {
    if (!search.trim()) return true;
    return c.name.toLowerCase().includes(search.toLowerCase());
  }) ?? [];

  function openCreate() {
    setSelected(null);
    setModal("create");
  }

  function openEdit(cat: { id: number; name: string; icon: string; color: string; isDefault: boolean }) {
    setSelected(cat);
    setModal("edit");
  }

  async function openDelete(cat: { id: number; name: string; icon: string; color: string; isDefault: boolean }) {
    try {
      const res = await fetch(`/api/categories/${cat.id}/transactions-count`, { cache: "no-store" });
      const count = res.ok ? await res.json() : 0;
      setSelected(cat);
      setDeleteCount(count);
      setModal("delete");
    } catch {
      toast.error("No se pudo validar la categoria");
    }
  }

  function closeModal() {
    setModal(null);
    setSelected(null);
  }

  async function handleCreate(values: CategoryFormValues) {
    await createCategory(values);
    toast.success("Categoria creada");
    closeModal();
    await mutate();
  }

  async function handleEdit(values: CategoryFormValues) {
    if (!selected) return;
    await updateCategory(selected.id, values);
    toast.success("Categoria actualizada");
    closeModal();
    await mutate();
  }

  async function handleReassign(targetId: number) {
    if (!selected) return;
    await deleteCategoryWithReassign(selected.id, targetId);
    toast.success("Categoria eliminada y transacciones reasignadas");
    closeModal();
    await mutate();
  }

  async function handleDeleteTransactions() {
    if (!selected) return;
    await deleteCategoryWithTransactions(selected.id);
    toast.success("Categoria y transacciones eliminadas");
    closeModal();
    await mutate();
  }

  async function handleSimpleDelete() {
    if (!selected) return;
    await removeCategory(selected.id);
    toast.success("Categoria eliminada");
    closeModal();
    await mutate();
  }

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar categorias..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl bg-muted py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {filtered.map((cat) => {
          const Icon = iconMap[cat.icon] || CircleEllipsis;
          return (
            <div
              key={cat.id}
              className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl bg-surface p-3 shadow-sm transition hover:shadow-md"
              onClick={() => openEdit(cat)}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: `${cat.color}20` }}
              >
                <Icon className="h-6 w-6" style={{ color: cat.color }} />
              </div>
              <p className="text-center text-[11px] font-semibold leading-tight">
                {cat.name}
              </p>
            </div>
          );
        })}

        <button
          onClick={openCreate}
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-muted-foreground/30 text-muted-foreground transition hover:border-primary hover:text-primary"
        >
          <Plus className="h-6 w-6" />
          <p className="text-center text-[11px] font-semibold leading-tight">Agregar</p>
        </button>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border bg-card p-6 shadow-xl">
            {modal === "create" && (
              <>
                <h2 className="mb-4 text-lg font-semibold">Nueva categoria</h2>
                <CategoryForm onSave={handleCreate} onCancel={closeModal} />
              </>
            )}

            {modal === "edit" && selected && (
              <>
                <h2 className="mb-4 text-lg font-semibold">Editar categoria</h2>
                <CategoryForm
                  initial={{ name: selected.name, icon: selected.icon, color: selected.color }}
                  onSave={handleEdit}
                  onCancel={closeModal}
                />
              </>
            )}

            {modal === "delete" && selected && (
              deleteCount > 0 ? (
                <DeleteCategoryDialog
                  category={selected}
                  transactionsCount={deleteCount}
                  onReassign={handleReassign}
                  onDeleteTransactions={handleDeleteTransactions}
                  onCancel={closeModal}
                />
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Eliminar categoria</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Estas seguro de eliminar <strong>{selected.name}</strong>?
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="danger" onClick={handleSimpleDelete}>Eliminar</Button>
                    <Button type="button" variant="secondary" onClick={closeModal}>Cancelar</Button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
