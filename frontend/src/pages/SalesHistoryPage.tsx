import { useEffect, useState } from "react";
import { getSaleHistory } from "../services/salesService";
import type { SaleHistoryEntry } from "../types/sale";

export default function SalesHistoryPage() {
  const [sales, setSales] = useState<SaleHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("ALL");

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

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal">
            Sale History
          </h1>
          <p className="text-graytext text-sm mt-1">
            Monitor all furniture transactions across branches.
          </p>
        </div>

        {!loading && !error && (
          <div className="bg-white rounded-xl border border-black/10 px-5 py-3 text-right">
            <p className="text-xs text-graytext font-medium">Total Revenue</p>
            <p className="font-display text-lg font-semibold text-charcoal">
              {totalRevenue.toLocaleString()} ETB
            </p>
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
        <div className="flex items-center gap-3 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by item, employee, or branch..."
            className="flex-1 border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand bg-white"
          />
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
              <tr className="border-b border-black/10 bg-black/[0.02] text-left text-graytext text-xs uppercase tracking-wide">
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
                  <td className="px-5 py-4 text-graytext">{formatDate(sale.soldAt)}</td>
                  <td className="px-5 py-4 font-semibold text-charcoal">
                    {sale.itemCode}
                  </td>
                  <td className="px-5 py-4 text-graytext">{sale.itemType}</td>
                  <td className="px-5 py-4 text-charcoal">{sale.quantitySold}</td>
                  <td className="px-5 py-4 text-charcoal">
                    {(sale.priceAtSale * sale.quantitySold).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-graytext">{sale.branchName}</td>
                  <td className="px-5 py-4 text-graytext">{sale.soldByName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}