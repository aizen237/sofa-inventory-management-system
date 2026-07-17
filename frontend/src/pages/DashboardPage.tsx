import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import { getSaleHistory } from "../services/salesService";
import { getItems } from "../services/inventoryService";
import type { DashboardStats } from "../types/dashboard";
import type { SaleHistoryEntry } from "../types/sale";
import type { InventoryItem } from "../types/inventory";
import {
  Package,
  Wallet,
  Sofa,
  Armchair,
  Table2,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const LOW_STOCK_THRESHOLD = 5;

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-black/10 p-5 flex items-start justify-between hover:shadow-sm transition-shadow">
      <div>
        <p className="text-xs text-graytext font-medium mb-1.5">{label}</p>
        <p className="font-display text-2xl font-semibold text-charcoal">
          {value}
        </p>
      </div>
      <div className="bg-brand/10 text-brand rounded-lg p-2.5">{icon}</div>
    </div>
  );
}

function buildSevenDayRevenue(sales: SaleHistoryEntry[]) {
  const days: { date: string; label: string; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({
      date: key,
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      revenue: 0,
    });
  }

  sales.forEach((sale) => {
    const key = sale.soldAt.slice(0, 10);
    const day = days.find((d) => d.date === key);
    if (day) {
      day.revenue += sale.priceAtSale * sale.quantitySold;
    }
  });

  return days;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sales, setSales] = useState<SaleHistoryEntry[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const [statsData, salesData, itemsData] = await Promise.all([
        getDashboardStats(),
        getSaleHistory(),
        getItems(),
      ]);
      setStats(statsData);
      setSales(salesData);
      setItems(itemsData);
    } catch {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
    loadAll();
  }, []);

  const chartData = buildSevenDayRevenue(sales);
  const lowStockItems = items
    .filter((i) => i.status !== "ARCHIVED" && i.quantity <= LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 6);
  const recentSales = sales.slice(0, 6);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-charcoal">
          Dashboard
        </h1>
        <p className="text-graytext text-sm mt-1">
          Welcome back. Here's what's happening today.
        </p>
      </div>

      {loading && (
        <div className="bg-white rounded-xl border border-black/10 p-10 text-center text-graytext text-sm">
          Loading...
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && !error && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard
              label="Total Items"
              value={stats.totalItems.toLocaleString()}
              icon={<Package size={18} />}
            />
            <StatCard
              label="Total Value"
              value={`${stats.totalValue.toLocaleString()} ETB`}
              icon={<Wallet size={18} />}
            />
            <StatCard
              label="Sofas"
              value={stats.totalSofas.toLocaleString()}
              icon={<Sofa size={18} />}
            />
            <StatCard
              label="Chairs"
              value={stats.totalChairs.toLocaleString()}
              icon={<Armchair size={18} />}
            />
            <StatCard
              label="Tables"
              value={stats.totalTables.toLocaleString()}
              icon={<Table2 size={18} />}
            />
            <StatCard
              label="Sold Today"
              value={stats.itemsSoldToday.toLocaleString()}
              icon={<TrendingUp size={18} />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Sales trend chart */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-black/10 p-5">
              <h2 className="font-display font-semibold text-charcoal mb-1">
                Revenue (Last 7 Days)
              </h2>
              <p className="text-xs text-graytext mb-4">
                Daily revenue in ETB
              </p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(0,0,0,0.06)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 12, fill: "#6B6B6B" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#6B6B6B" }}
                      axisLine={false}
                      tickLine={false}
                      width={45}
                    />
                    <Tooltip
  formatter={(value) => {
    const amount = typeof value === "number" ? value : Number(value ?? 0);
    return [`${amount.toLocaleString()} ETB`, "Revenue"];
  }}
  contentStyle={{
    borderRadius: 8,
    border: "1px solid rgba(0,0,0,0.1)",
    fontSize: 13,
  }}
/>
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#D2691E"
                      strokeWidth={2.5}
                      dot={{ fill: "#D2691E", r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Low stock list */}
            <div className="bg-white rounded-xl border border-black/10 p-5">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={16} className="text-amber-500" />
                <h2 className="font-display font-semibold text-charcoal">
                  Low Stock
                </h2>
              </div>
              <p className="text-xs text-graytext mb-4">
                {LOW_STOCK_THRESHOLD} units or fewer
              </p>
              {lowStockItems.length === 0 ? (
                <p className="text-sm text-graytext py-6 text-center">
                  Nothing running low.
                </p>
              ) : (
                <div className="space-y-3">
                  {lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div>
                        <p className="font-medium text-charcoal">{item.code}</p>
                        <p className="text-xs text-graytext">{item.branchName}</p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          item.quantity === 0
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {item.quantity} left
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-xl border border-black/10 p-5">
            <h2 className="font-display font-semibold text-charcoal mb-1">
              Recent Sales
            </h2>
            <p className="text-xs text-graytext mb-4">
              Latest transactions across all branches
            </p>
            {recentSales.length === 0 ? (
              <p className="text-sm text-graytext py-6 text-center">
                No sales recorded yet.
              </p>
            ) : (
              <div className="divide-y divide-black/5">
                {recentSales.map((sale) => (
                  <div
                    key={sale.saleId}
                    className="flex items-center justify-between py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-charcoal">
                        {sale.soldByName} sold {sale.quantitySold}x {sale.itemCode}
                      </p>
                      <p className="text-xs text-graytext">
                        {sale.branchName} · {formatDate(sale.soldAt)}
                      </p>
                    </div>
                    <p className="font-semibold text-charcoal">
                      {(sale.priceAtSale * sale.quantitySold).toLocaleString()} ETB
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}