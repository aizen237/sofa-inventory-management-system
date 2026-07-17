import { useEffect, useState } from "react";
import { getAuditLogs } from "../services/auditLogService";
import type { AuditLogEntry } from "../types/auditLog";

const actionStyles: Record<string, string> = {
  LOGIN: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20",
  CREATE: "bg-green-50 text-green-700 ring-1 ring-green-600/20",
  UPDATE: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
  SOLD: "bg-brand/10 text-brand-dark ring-1 ring-brand/20",
  DELETE: "bg-red-50 text-red-700 ring-1 ring-red-600/20",
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");

  const actions = Array.from(new Set(logs.map((l) => l.action))).sort();

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      log.userName.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.entityType.toLowerCase().includes(q);
    const matchesAction = actionFilter === "ALL" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

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
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-charcoal">
          Audit Logs
        </h1>
        <p className="text-graytext text-sm mt-1">
          Review system activity across all branches.
        </p>
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
            placeholder="Search by user, module, or details..."
            className="flex-1 border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand bg-white"
          />
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
              <tr className="border-b border-black/10 bg-black/[0.02] text-left text-graytext text-xs uppercase tracking-wide">
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
                  <td className="px-5 py-4 font-medium text-charcoal">
                    {log.userName}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        actionStyles[log.action] ??
                        "bg-gray-100 text-gray-600 ring-1 ring-gray-400/20"
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