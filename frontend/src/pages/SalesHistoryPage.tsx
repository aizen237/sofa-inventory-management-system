import { useEffect, useState } from "react";
import { getSaleHistory } from "../services/salesService";
import type { SaleHistoryEntry } from "../types/sale";

export default function SalesHistoryPage() {
  const [sales, setSales] = useState<SaleHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const totalRevenue = sales.reduce(
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
              {sales.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-graytext">
                    No sales recorded yet.
                  </td>
                </tr>
              )}
              {sales.map((sale) => (
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