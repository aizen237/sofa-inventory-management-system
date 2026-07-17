import { useEffect, useState } from "react";
import { getItems } from "../services/inventoryService";
import type { InventoryItem } from "../types/inventory";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";
import SellItemModal from "./SellItemModal";

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [sellingItem, setSellingItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "AVAILABLE" | "UNAVAILABLE">("ALL");

  const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemType]);

  const itemLabel = itemType.charAt(0) + itemType.slice(1).toLowerCase();

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal">
            {title}
          </h1>
          <p className="text-graytext text-sm mt-1">{description}</p>
        </div>

        <div className="flex items-start gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-brand hover:bg-brand-dark text-white font-medium text-sm rounded-lg px-4 py-2.5 transition-colors"
          >
            + Add {itemLabel}
          </button>

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
      </div>

      {loading && (
        <div className="bg-white rounded-xl border border-black/10 p-10 text-center text-graytext text-sm">
          Loading...
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && !error && (
        <div className="flex items-center gap-3 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by code or description..."
            className="flex-1 border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand bg-white"
          />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "ALL" | "AVAILABLE" | "UNAVAILABLE")
            }
            className="border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </select>
        </div>
      )}

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
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-graytext">
                    {items.length === 0 ? "No items found." : "No items match your search."}
                  </td>
                </tr>
              )}
              {filteredItems.map((item) => (
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
                  <td className="px-5 py-4 text-right space-x-3">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="text-charcoal/60 hover:text-charcoal font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setSellingItem(item)}
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

      {showAddModal && (
        <AddItemModal
          itemType={itemType}
          onClose={() => setShowAddModal(false)}
          onSuccess={loadItems}
        />
      )}

      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={loadItems}
        />
      )}

      {sellingItem && (
        <SellItemModal
          item={sellingItem}
          onClose={() => setSellingItem(null)}
          onSuccess={loadItems}
        />
      )}
    </div>
  );
}