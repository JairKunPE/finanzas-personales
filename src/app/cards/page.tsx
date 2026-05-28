"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { useCards, createCard, updateCard, removeCard, type CardDto } from "@/lib/api/cards";
import { CreditCardForm, type CardFormValues } from "@/components/cards/credit-card-form";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import type { CreditCardInsert } from "@/lib/validation";

function CardItem({
  card,
  onEdit,
  onDelete,
}: {
  card: CardDto;
  onEdit: (card: CardDto) => void;
  onDelete: (card: CardDto) => void;
}) {
  return (
    <div className="rounded-2xl bg-surface p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${card.color}18` }}
        >
          <div className="h-4 w-4 rounded-sm" style={{ backgroundColor: card.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{card.name}</p>
          <p className="text-xs text-muted-foreground">
            Corte: dia {card.statementDay} | Pago: dia {card.paymentDay}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Limite de credito</p>
          <p className="text-sm font-bold" style={{ color: card.color }}>
            S/ {card.limitAmount.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="flex gap-1">
          <Button variant="secondary" onClick={() => onEdit(card)}>Editar</Button>
          <Button variant="secondary" onClick={() => onDelete(card)}>Eliminar</Button>
        </div>
      </div>
    </div>
  );
}

export default function CardsPage() {
  const { data: cards, isLoading, error } = useCards();
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<CardDto | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleCreate(values: CardFormValues) {
    setSaving(true);
    try {
      await createCard(values as CreditCardInsert);
      toast.success("Tarjeta creada");
      setShowForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al crear la tarjeta");
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(values: CardFormValues) {
    if (!editingCard) return;
    setSaving(true);
    try {
      await updateCard(editingCard.id, values as CreditCardInsert);
      toast.success("Tarjeta actualizada");
      setEditingCard(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al actualizar la tarjeta");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(card: CardDto) {
    if (!confirm("Eliminar esta tarjeta? Las transacciones vinculadas quedaran sin tarjeta asociada.")) return;
    try {
      await removeCard(card.id, false);
      toast.success("Tarjeta eliminada");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar la tarjeta");
    }
  }

  if (isLoading) return <LoadingState />;
  if (error) return <p className="text-center text-sm text-muted-foreground">No se pudieron cargar las tarjetas</p>;

  if (showForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Nueva tarjeta</h2>
          <Button variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
        </div>
        <CreditCardForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
      </div>
    );
  }

  if (editingCard) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Editar tarjeta</h2>
          <Button variant="secondary" onClick={() => setEditingCard(null)}>Cancelar</Button>
        </div>
        <CreditCardForm
          initial={{
            name: editingCard.name,
            limitAmount: editingCard.limitAmount,
            statementDay: editingCard.statementDay,
            paymentDay: editingCard.paymentDay,
            color: editingCard.color,
          }}
          onSave={handleEdit}
          onCancel={() => setEditingCard(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Tarjetas de Credito</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-1 h-4 w-4" /> Agregar
        </Button>
      </div>

      {cards && cards.length > 0 ? (
        <div className="space-y-3">
          {cards.map((card) => (
            <CardItem key={card.id} card={card} onEdit={setEditingCard} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <EmptyState title="Sin tarjetas" description="No tienes tarjetas de credito registradas" />
      )}
    </div>
  );
}
