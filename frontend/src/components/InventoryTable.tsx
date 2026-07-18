import { useEffect, useState } from "react";
import { getItems } from "../services/inventoryService";
import type { InventoryItem } from "../types/inventory";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";
import SellItemModal from "./SellItemModal";
import {
  Plus,
  Search,
  Pencil,
  Tag,
  Wallet,
  Package,
  Building2,
  MapPin,
  Sofa as SofaIcon,
  Armchair,
  Table2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

interface Props {
  itemType: "SOFA" | "CHAIR" | "TABLE";
  title: string;
  description: string;
}

type StatusFilter = "ALL" | "AVAILABLE" | "UNAVAILABLE";

const statusStyles: Record<string, string> = {
  AVAILABLE: "bg-green-50 text-green-700",
  UNAVAILABLE: "bg-red-50 text-red-700",
  ARCHIVED: "bg-gray-100 text-gray-600",
};

const statusDot: Record<string, string> = {
  AVAILABLE: "bg-green-500",
  UNAVAILABLE: "bg-red-500",
  ARCHIVED: "bg-gray-400",
};

const typeIcons = {
  SOFA: SofaIcon,
  CHAIR: Armchair,
  TABLE: Table2,
};

const PAGE_SIZES = [10, 25, 50];

export default function InventoryTable({ itemType, title, description }: Props) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [sellingItem, setSellingItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"NEWEST" | "OLDEST" | "PRICE_HIGH" | "PRICE_LOW">("NEWEST");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const branchNames = Array.from(new Set(items.map((i) => i.branchName))).sort();

  const filteredItems = items
    .filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.code.toLowerCase().includes(q) ||
        (item.description ?? "").toLowerCase().includes(q) ||
        item.branchName.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
      const matchesBranch = branchFilter === "ALL" || item.branchName === branchFilter;
      return matchesSearch && matchesStatus && matchesBranch;
    })
    .sort((a, b) => {
      if (sortBy === "NEWEST") return b.createdAt.localeCompare(a.createdAt);
      if (sortBy === "OLDEST") return a.createdAt.localeCompare(b.createdAt);
      if (sortBy === "PRICE_HIGH") return b.price - a.price;
      return a.price - b.price;
    });

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedItems = filteredItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function resetFilters() {
    setSearchQuery("");
    setStatusFilter("ALL");
    setBranchFilter("ALL");
    setSortBy("NEWEST");
    setPage(1);
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setPage(1);
  }

  function handleStatusChange(value: StatusFilter) {
    setStatusFilter(value);
    setPage(1);
  }

  function handleBranchChange(value: string) {
    setBranchFilter(value);
    setPage(1);
  }

  function handleSortChange(value: typeof sortBy) {
    setSortBy(value);
    setPage(1);
  }

  function handlePageSizeChange(value: string) {
    setPageSize(Number(value));
    setPage(1);
  }

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
  const TypeIcon = typeIcons[itemType];

  return (
    <div>
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
            <TypeIcon size={22} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-charcoal">
              {title}
            </h1>
            <p className="text-graytext text-sm mt-0.5">{description}</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-brand hover:bg-brand-dark text-white font-medium text-sm rounded-lg px-4 py-2.5 shadow-sm shadow-brand/30 transition-all hover:shadow-md"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add {itemLabel}
        </button>
      </div>

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-xl border border-black/10 p-4 flex items-center gap-3">
            <div className="bg-brand/10 text-brand rounded-lg p-2.5 shrink-0">
              <Wallet size={18} />
            </div>
            <div>
              <p className="text-xs text-graytext font-medium">Total Value</p>
              <p className="font-display text-lg font-semibold text-charcoal leading-tight">
                {totalValue.toLocaleString()} ETB
              </p>
              <p className="text-[11px] text-graytext">Across all branches</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-black/10 p-4 flex items-center gap-3">
            <div className="bg-green-50 text-green-600 rounded-lg p-2.5 shrink-0">
              <Package size={18} />
            </div>
            <div>
              <p className="text-xs text-graytext font-medium">Total Units</p>
              <p className="font-display text-lg font-semibold text-charcoal leading-tight">
                {totalUnits.toLocaleString()}
              </p>
              <p className="text-[11px] text-graytext">{itemLabel}s in inventory</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-black/10 p-4 flex items-center gap-3">
            <div className="bg-blue-50 text-blue-600 rounded-lg p-2.5 shrink-0">
              <Building2 size={18} />
            </div>
            <div>
              <p className="text-xs text-graytext font-medium">Branches</p>
              <p className="font-display text-lg font-semibold text-charcoal leading-tight">
                {branchNames.length}
              </p>
              <p className="text-[11px] text-graytext">Active branches</p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-xl border border-black/10 p-10 text-center text-graytext text-sm">
          Loading...
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && !error && (
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-graytext"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by code, description or branch..."
              className="w-full border border-black/10 rounded-lg pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand bg-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-graytext mb-0.5 px-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value as StatusFilter)}
              className="border border-black/10 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand bg-white"
            >
              <option value="ALL">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>
          </div>

          {branchNames.length > 1 && (
            <div>
              <label className="block text-[10px] font-medium text-graytext mb-0.5 px-1">
                Branch
              </label>
              <select
                value={branchFilter}
                onChange={(e) => handleBranchChange(e.target.value)}
                className="border border-black/10 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand bg-white"
              >
                <option value="ALL">All Branches</option>
                {branchNames.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-medium text-graytext mb-0.5 px-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
              className="border border-black/10 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand bg-white"
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
              <option value="PRICE_HIGH">Price: High to Low</option>
              <option value="PRICE_LOW">Price: Low to High</option>
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 border border-brand/30 text-brand hover:bg-brand/5 font-medium text-sm rounded-lg px-3.5 py-2 transition-colors self-end"
          >
            <RotateCcw size={14} />
            Reset Filters
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-xl border border-black/10 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-brand/5 text-left text-graytext text-xs uppercase tracking-wide">
                <th className="px-5 py-3.5 font-semibold">Code</th>
                <th className="px-5 py-3.5 font-semibold">Price (ETB)</th>
                <th className="px-5 py-3.5 font-semibold">Qty</th>
                <th className="px-5 py-3.5 font-semibold">Branch</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {pagedItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-graytext">
                    {items.length === 0 ? "No items found." : "No items match your search."}
                  </td>
                </tr>
              )}
              {pagedItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-black/5 last:border-0 hover:bg-black/[0.015] transition-colors"
                >
                  <td className="px-5 py-4 font-semibold text-charcoal">
                    {item.code}
                  </td>
                  <td className="px-5 py-4 text-brand font-semibold">
                    {item.price.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-charcoal">{item.quantity}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 bg-brand/10 text-brand-dark px-2.5 py-1 rounded-full text-xs font-medium">
                      <MapPin size={11} />
                      {item.branchName}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[item.status]}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[item.status]}`} />
                      {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="flex items-center gap-1 text-xs font-medium text-charcoal/70 hover:text-charcoal bg-black/[0.03] hover:bg-black/[0.06] rounded-md px-2.5 py-1.5 transition-colors"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() => setSellingItem(item)}
                        disabled={item.quantity === 0}
                        className="flex items-center gap-1 text-xs font-semibold text-white bg-brand hover:bg-brand-dark rounded-md px-2.5 py-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Tag size={12} />
                        Sold
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredItems.length > 0 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-black/10 text-sm">
              <p className="text-graytext text-xs">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, filteredItems.length)} of{" "}
                {filteredItems.length} results
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-black/10 text-charcoal disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 transition-colors"
                >
                  <ChevronLeft size={15} />
                </button>
                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand text-white text-xs font-semibold">
                  {currentPage}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-black/10 text-charcoal disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 transition-colors"
                >
                  <ChevronRight size={15} />
                </button>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(e.target.value)}
                  className="border border-black/10 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand/40 bg-white ml-1"
                >
                  {PAGE_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size} / page
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
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