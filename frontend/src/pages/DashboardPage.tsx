import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import type { DashboardStats } from "../types/dashboard";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-black/10 p-5">
      <p className="text-xs text-graytext font-medium mb-1">{label}</p>
      <p className="font-display text-2xl font-semibold text-charcoal">
        {value}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadStats() {
    setLoading(true);
    setError("");
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch {
      setError("Failed to load dashboard stats.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
    loadStats();
  }, []);

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Total Items" value={stats.totalItems.toLocaleString()} />
          <StatCard
            label="Total Value"
            value={`${stats.totalValue.toLocaleString()} ETB`}
          />
          <StatCard label="Sofas" value={stats.totalSofas.toLocaleString()} />
          <StatCard label="Chairs" value={stats.totalChairs.toLocaleString()} />
          <StatCard label="Tables" value={stats.totalTables.toLocaleString()} />
          <StatCard
            label="Sold Today"
            value={stats.itemsSoldToday.toLocaleString()}
          />
        </div>
      )}
    </div>
  );
}