import { useEffect, useState } from "react";
import { getSaleHistory } from "../services/salesService";
import type { SaleHistoryEntry } from "../types/sale";
import { Search, History, Wallet, TrendingUp, FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAuthStore } from "../store/authStore";

export default function SalesHistoryPage() {
  const [sales, setSales] = useState<SaleHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const role = useAuthStore((state) => state.role);

  const branches = Array.from(new Set(sales.map((s) => s.branchName))).sort();

  const filteredSales = sales.filter((sale) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      sale.itemCode.toLowerCase().includes(q) ||
      sale.soldByName.toLowerCase().includes(q) ||
      sale.branchName.toLowerCase().includes(q);
    const matchesBranch = branchFilter === "ALL" || sale.branchName === branchFilter;
    return matchesSearch && matchesBranch;
  });

  const totalRevenue = filteredSales.reduce(
    (sum, s) => sum + s.priceAtSale * s.quantitySold,
    0
  );
  const totalUnitsSold = filteredSales.reduce((sum, s) => sum + s.quantitySold, 0);

  async function loadSales() {
    setLoading(true);
    setError("");
    try {
      const data = await getSaleHistory();
      setSales(data);
    } catch {
      setError("Failed to load sale history.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
    loadSales();
  }, []);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function initials(name: string) {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function exportToPDF() {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Lehulu General Trading — Sale History", 14, 15);

    doc.setFontSize(10);
    doc.setTextColor(100);
    const filterSummary = `Branch: ${branchFilter === "ALL" ? "All Branches" : branchFilter}${
      searchQuery ? ` · Search: "${searchQuery}"` : ""
    } · Generated: ${new Date().toLocaleString()}`;
    doc.text(filterSummary, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [["Date", "Item", "Type", "Qty", "Price (ETB)", "Branch", "Sold By"]],
      body: filteredSales.map((s) => [
        formatDate(s.soldAt),
        s.itemCode,
        s.itemType,
        String(s.quantitySold),
        (s.priceAtSale * s.quantitySold).toLocaleString(),
        s.branchName,
        s.soldByName,
      ]),
      headStyles: { fillColor: [210, 105, 30] },
      styles: { fontSize: 9 },
    });

    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Total Revenue: ${totalRevenue.toLocaleString()} ETB`, 14, finalY + 10);

    doc.save(`sale-history-${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
            <History size={22} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-charcoal">
              Sale History
            </h1>
            <p className="text-graytext text-sm mt-0.5">
              Monitor all furniture transactions across branches.
            </p>
          </div>
        </div>

        {role === "OWNER" && !loading && !error && (
          <button
            onClick={exportToPDF}
            className="flex items-center gap-1.5 bg-brand hover:bg-brand-dark text-white font-medium text-sm rounded-lg px-4 py-2.5 shadow-sm shadow-brand/30 transition-all hover:shadow-md"
          >
            <FileDown size={16} />
            Export PDF
          </button>
        )}
      </div>

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-xl border border-black/10 p-4 flex items-center gap-3">
            <div className="bg-brand/10 text-brand rounded-lg p-2.5 shrink-0">
              <Wallet size={18} />
            </div>
            <div>
              <p className="text-xs text-graytext font-medium">Total Revenue</p>
              <p className="font-display text-lg font-semibold text-charcoal leading-tight">
                {totalRevenue.toLocaleString()} ETB
              </p>
              <p className="text-[11px] text-graytext">From filtered results</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-black/10 p-4 flex items-center gap-3">
            <div className="bg-green-50 text-green-600 rounded-lg p-2.5 shrink-0">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-xs text-graytext font-medium">Units Sold</p>
              <p className="font-display text-lg font-semibold text-charcoal leading-tight">
                {totalUnitsSold.toLocaleString()}
              </p>
              <p className="text-[11px] text-graytext">From filtered results</p>
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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by item, employee, or branch..."
              className="w-full border border-black/10 rounded-lg pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand bg-white"
            />
          </div>
          {branches.length > 1 && (
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand bg-white"
            >
              <option value="ALL">All Branches</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-xl border border-black/10 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-brand/5 text-left text-graytext text-xs uppercase tracking-wide">
                <th className="px-5 py-3.5 font-semibold">Date</th>
                <th className="px-5 py-3.5 font-semibold">Item</th>
                <th className="px-5 py-3.5 font-semibold">Type</th>
                <th className="px-5 py-3.5 font-semibold">Qty Sold</th>
                <th className="px-5 py-3.5 font-semibold">Price (ETB)</th>
                <th className="px-5 py-3.5 font-semibold">Branch</th>
                <th className="px-5 py-3.5 font-semibold">Sold By</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-graytext">
                    {sales.length === 0
                      ? "No sales recorded yet."
                      : "No sales match your search."}
                  </td>
                </tr>
              )}
              {filteredSales.map((sale) => (
                <tr
                  key={sale.saleId}
                  className="border-b border-black/5 last:border-0 hover:bg-black/[0.015] transition-colors"
                >
                  <td className="px-5 py-4 text-graytext whitespace-nowrap">
                    {formatDate(sale.soldAt)}
                  </td>
                  <td className="px-5 py-4 font-semibold text-charcoal">
                    {sale.itemCode}
                  </td>
                  <td className="px-5 py-4 text-graytext">{sale.itemType}</td>
                  <td className="px-5 py-4 text-charcoal">{sale.quantitySold}</td>
                  <td className="px-5 py-4 text-brand font-semibold">
                    {(sale.priceAtSale * sale.quantitySold).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 bg-brand/10 text-brand-dark px-2.5 py-1 rounded-full text-xs font-medium">
                      {sale.branchName}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand/10 text-brand flex items-center justify-center text-[10px] font-semibold shrink-0">
                        {initials(sale.soldByName)}
                      </div>
                      <span className="text-graytext">{sale.soldByName}</span>
                    </div>
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