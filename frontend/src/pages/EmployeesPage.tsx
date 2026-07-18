import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";
import type { UserSummary } from "../types/user";
import AddEmployeeModal from "../components/AddEmployeeModal";
import EditUserModal from "../components/EditUserModal";
import {
  Plus,
  Search,
  Pencil,
  Users as UsersIcon,
  UserCheck,
  Building2,
} from "lucide-react";

export default function EmployeesPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const totalEmployees = users.filter((u) => u.role === "EMPLOYEE").length;
  const activeCount = users.filter((u) => u.active).length;
  const branchCount = Array.from(new Set(users.map((u) => u.branchName))).filter(
    (b) => b !== "—"
  ).length;

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.branchName.toLowerCase().includes(q)
    );
  });

  function initials(name: string) {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
    loadUsers();
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
            <UsersIcon size={22} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-charcoal">
              Employees
            </h1>
            <p className="text-graytext text-sm mt-0.5">
              Manage staff accounts and branch assignments.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-brand hover:bg-brand-dark text-white font-medium text-sm rounded-lg px-4 py-2.5 shadow-sm shadow-brand/30 transition-all hover:shadow-md"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add Employee
        </button>
      </div>

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-xl border border-black/10 p-4 flex items-center gap-3">
            <div className="bg-brand/10 text-brand rounded-lg p-2.5 shrink-0">
              <UsersIcon size={18} />
            </div>
            <div>
              <p className="text-xs text-graytext font-medium">Total Employees</p>
              <p className="font-display text-lg font-semibold text-charcoal leading-tight">
                {totalEmployees}
              </p>
              <p className="text-[11px] text-graytext">Excluding owner</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-black/10 p-4 flex items-center gap-3">
            <div className="bg-green-50 text-green-600 rounded-lg p-2.5 shrink-0">
              <UserCheck size={18} />
            </div>
            <div>
              <p className="text-xs text-graytext font-medium">Active Accounts</p>
              <p className="font-display text-lg font-semibold text-charcoal leading-tight">
                {activeCount}
              </p>
              <p className="text-[11px] text-graytext">Currently active</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-black/10 p-4 flex items-center gap-3">
            <div className="bg-blue-50 text-blue-600 rounded-lg p-2.5 shrink-0">
              <Building2 size={18} />
            </div>
            <div>
              <p className="text-xs text-graytext font-medium">Branches Covered</p>
              <p className="font-display text-lg font-semibold text-charcoal leading-tight">
                {branchCount}
              </p>
              <p className="text-[11px] text-graytext">With staff assigned</p>
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
        <div className="relative mb-4">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-graytext"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, username, or branch..."
            className="w-full border border-black/10 rounded-lg pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand bg-white"
          />
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-xl border border-black/10 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-brand/5 text-left text-graytext text-xs uppercase tracking-wide">
                <th className="px-5 py-3.5 font-semibold">Name</th>
                <th className="px-5 py-3.5 font-semibold">Username</th>
                <th className="px-5 py-3.5 font-semibold">Role</th>
                <th className="px-5 py-3.5 font-semibold">Branch</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-graytext">
                    {users.length === 0 ? "No employees found." : "No employees match your search."}
                  </td>
                </tr>
              )}
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-black/5 last:border-0 hover:bg-black/[0.015] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-semibold shrink-0">
                        {initials(user.name)}
                      </div>
                      <span className="font-semibold text-charcoal">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-graytext font-mono text-xs">
                    {user.email}
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand/10 text-brand-dark">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-charcoal">{user.branchName}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.active
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.active ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="flex items-center gap-1 text-xs font-medium text-charcoal/70 hover:text-charcoal bg-black/[0.03] hover:bg-black/[0.06] rounded-md px-2.5 py-1.5 transition-colors ml-auto"
                    >
                      <Pencil size={12} />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onSuccess={loadUsers}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={loadUsers}
        />
      )}
    </div>
  );
}