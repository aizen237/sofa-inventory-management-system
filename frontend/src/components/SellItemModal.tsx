import { useState } from "react";
import { sellItem } from "../services/inventoryService";
import type { InventoryItem } from "../types/inventory";
import { useToastStore } from "../store/toastStore";

interface Props {
  item: InventoryItem;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SellItemModal({ item, onClose, onSuccess }: Props) {
  const [quantity, setQuantity] = useState("1");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const showToast = useToastStore((state) => state.showToast);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      setError("Please enter a valid whole number greater than zero.");
      return;
    }

    setSubmitting(true);
    try {
      await sellItem(item.id, qty);
      showToast(`Sold ${qty} unit(s) of ${item.code}.`);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to record sale.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="font-display text-xl font-semibold text-charcoal mb-1">
          Record Sale
        </h2>
        <p className="text-graytext text-sm mb-5">
          {item.code} — {item.quantity} unit(s) in stock.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-graytext mb-1.5">
              Quantity Sold *
            </label>
            <input
              type="number"
              min="1"
              max={item.quantity}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              autoFocus
              className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-black/10 text-charcoal font-medium text-sm rounded-lg py-2.5 hover:bg-black/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-brand hover:bg-brand-dark text-white font-medium text-sm rounded-lg py-2.5 transition-colors disabled:opacity-60"
            >
              {submitting ? "Recording..." : "Confirm Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}