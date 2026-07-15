import { useEffect, useState } from "react";
import { getItems, sellItem } from "../services/inventoryService";
import type { InventoryItem } from "../types/inventory";

interface Props {
  itemType: "SOFA" | "CHAIR" | "TABLE";
  title: string;
  description: string;
}

const statusStyles: Record<string, string> = {
  AVAILABLE: "bg-green-50 text-green-700 ring-1 ring-green-600/20",
  UNAVAILABLE: "bg-red-50 text-red-700 ring-1 ring-red-600/20",
  ARCHIVED: "bg-gray-100 text-gray-600 ring-1 ring-gray-400/20",
};

export default function InventoryTable({ itemType, title, description }: Props) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const data = await getItems(itemType);
      setItems(data);
    } catch {
      setError("Failed to load items.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadItems();
  }, [itemType]);

  async function handleSell(item: InventoryItem) {
    const input = window.prompt(`How many units of ${item.code} did you sell?`);
    if (!input) return;

    const quantity = Number(input);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      alert("Please enter a valid whole number greater than zero.");
      return;
    }

    try {
      await sellItem(item.id, quantity);
      await loadItems();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to record sale.";
      alert(message);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal">
            {title}
          </h1>
          <p className="text-graytext text-sm mt-1">{description}</p>
        </div>

        {!loading && !error && (
          <div className="flex gap-3">
            <div className="bg-white rounded-xl border border-black/10 px-5 py-3 text-right">
              <p className="text-xs text-graytext font-medium">Total Value</p>
              <p className="font-display text-lg font-semibold text-charcoal">
                {totalValue.toLocaleString()} ETB
              </p>
            </div>
            <div className="bg-white rounded-xl border border-black/10 px-5 py-3 text-right">
              <p className="text-xs text-graytext font-medium">Total Units</p>
              <p className="font-display text-lg font-semibold text-charcoal">
                {totalUnits.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="bg-white rounded-xl border border-black/10 p-10 text-center text-graytext text-sm">
          Loading...
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-xl border border-black/10 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-black/[0.02] text-left text-graytext text-xs uppercase tracking-wide">
                <th className="px-5 py-3.5 font-semibold">Code</th>
                <th className="px-5 py-3.5 font-semibold">Price (ETB)</th>
                <th className="px-5 py-3.5 font-semibold">Qty</th>
                <th className="px-5 py-3.5 font-semibold">Branch</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-graytext">
                    No items found.
                  </td>
                </tr>
              )}
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-black/5 last:border-0 hover:bg-black/[0.015] transition-colors"
                >
                  <td className="px-5 py-4 font-semibold text-charcoal">
                    {item.code}
                  </td>
                  <td className="px-5 py-4 text-charcoal">
                    {item.price.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-charcoal">{item.quantity}</td>
                  <td className="px-5 py-4 text-graytext">{item.branchName}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleSell(item)}
                      disabled={item.quantity === 0}
                      className="text-brand hover:text-brand-dark font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      Sold
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}