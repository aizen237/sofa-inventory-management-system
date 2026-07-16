import { useState } from "react";
import api from "../services/api";
import { useToastStore } from "../store/toastStore";
import { useAuthStore } from "../store/authStore";
interface Props {
  itemType: "SOFA" | "CHAIR" | "TABLE";
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddItemModal({ itemType, onClose, onSuccess }: Props) {
  const role = useAuthStore((state) => state.role);
const userBranchId = useAuthStore((state) => state.branchId);
const [code, setCode] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [branchId, setBranchId] = useState(
  role === "OWNER" ? "" : String(userBranchId ?? "")
);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const showToast = useToastStore((state) => state.showToast);
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!code.trim() || !price || !quantity || !branchId) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/items", {
        code: code.trim(),
        itemType,
        price: Number(price),
        quantity: Number(quantity),
        description: description.trim(),
        branchId: Number(branchId),
      });
      showToast(`${code.trim()} added successfully.`);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to add item.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="font-display text-xl font-semibold text-charcoal mb-1">
          Add New {itemType.charAt(0) + itemType.slice(1).toLowerCase()}
        </h2>
        <p className="text-graytext text-sm mb-5">
          Enter the details for this item.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-graytext mb-1.5">
              Code *
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. BR15"
              className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-graytext mb-1.5">
                Price (ETB) *
              </label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-graytext mb-1.5">
                Quantity *
              </label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
              />
            </div>
          </div>

          {role === "OWNER" && (
            <div>
              <label className="block text-xs font-medium text-graytext mb-1.5">
                Branch *
              </label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand bg-white"
              >
                <option value="">Select branch</option>
                <option value="4">Addis Ababa</option>
                <option value="5">Hawassa</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-graytext mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand resize-none"
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
              {submitting ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}