import { useEffect, useState } from "react";
import { getAuditLogs } from "../services/auditLogService";
import type { AuditLogEntry } from "../types/auditLog";
import { Search, ShieldCheck, Activity, Users } from "lucide-react";

const actionStyles: Record<string, string> = {
  LOGIN: "bg-blue-50 text-blue-700",
  CREATE: "bg-green-50 text-green-700",
  UPDATE: "bg-amber-50 text-amber-700",
  SOLD: "bg-brand/10 text-brand-dark",
  DELETE: "bg-red-50 text-red-700",
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");

  const actions = Array.from(new Set(logs.map((l) => l.action))).sort();
  const uniqueUsers = Array.from(new Set(logs.map((l) => l.userName))).length;

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      log.userName.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.entityType.toLowerCase().includes(q);
    const matchesAction = actionFilter === "ALL" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  function initials(name: string) {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  async function loadLogs() {
    setLoading(true);
    setError("");
    try {
      const data = await getAuditLogs();
      setLogs(data);
    } catch {
      setError("Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
    loadLogs();
  }, []);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
          <ShieldCheck size={22} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal">
            Audit Logs
          </h1>
          <p className="text-graytext text-sm mt-0.5">
            Review system activity across all branches.
          </p>
        </div>
      </div>

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-xl border border-black/10 p-4 flex items-center gap-3">
            <div className="bg-brand/10 text-brand rounded-lg p-2.5 shrink-0">
              <Activity size={18} />
            </div>
            <div>
              <p className="text-xs text-graytext font-medium">Total Entries</p>
              <p className="font-display text-lg font-semibold text-charcoal leading-tight">
                {logs.length.toLocaleString()}
              </p>
              <p className="text-[11px] text-graytext">Recorded events</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-black/10 p-4 flex items-center gap-3">
            <div className="bg-blue-50 text-blue-600 rounded-lg p-2.5 shrink-0">
              <Users size={18} />
            </div>
            <div>
              <p className="text-xs text-graytext font-medium">Active Users</p>
              <p className="font-display text-lg font-semibold text-charcoal leading-tight">
                {uniqueUsers}
              </p>
              <p className="text-[11px] text-graytext">With logged activity</p>
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
              placeholder="Search by user, module, or details..."
              className="w-full border border-black/10 rounded-lg pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand bg-white"
            />
          </div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand bg-white"
          >
            <option value="ALL">All Actions</option>
            {actions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-xl border border-black/10 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-brand/5 text-left text-graytext text-xs uppercase tracking-wide">
                <th className="px-5 py-3.5 font-semibold">Date & Time</th>
                <th className="px-5 py-3.5 font-semibold">User</th>
                <th className="px-5 py-3.5 font-semibold">Action</th>
                <th className="px-5 py-3.5 font-semibold">Module</th>
                <th className="px-5 py-3.5 font-semibold">Branch</th>
                <th className="px-5 py-3.5 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-graytext">
                    {logs.length === 0
                      ? "No activity recorded yet."
                      : "No logs match your search."}
                  </td>
                </tr>
              )}
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-black/5 last:border-0 hover:bg-black/[0.015] transition-colors"
                >
                  <td className="px-5 py-4 text-graytext whitespace-nowrap">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand/10 text-brand flex items-center justify-center text-[10px] font-semibold shrink-0">
                        {initials(log.userName)}
                      </div>
                      <span className="font-medium text-charcoal">{log.userName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        actionStyles[log.action] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-graytext">{log.entityType}</td>
                  <td className="px-5 py-4 text-graytext">{log.branchName}</td>
                  <td className="px-5 py-4 text-charcoal">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}