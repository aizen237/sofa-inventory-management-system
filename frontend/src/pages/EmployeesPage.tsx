import { useEffect, useState } from "react";
import { getUsers } from "../services/userService.ts";
import type { UserSummary } from "../types/user";
import AddEmployeeModal from "../components/AddEmployeeModal";

export default function EmployeesPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal">
            Employees
          </h1>
          <p className="text-graytext text-sm mt-1">
            Manage staff accounts and branch assignments.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-brand hover:bg-brand-dark text-white font-medium text-sm rounded-lg px-4 py-2.5 transition-colors"
        >
          + Add Employee
        </button>
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
                <th className="px-5 py-3.5 font-semibold">Name</th>
                <th className="px-5 py-3.5 font-semibold">Username</th>
                <th className="px-5 py-3.5 font-semibold">Role</th>
                <th className="px-5 py-3.5 font-semibold">Branch</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-black/5 last:border-0 hover:bg-black/[0.015] transition-colors"
                >
                  <td className="px-5 py-4 font-semibold text-charcoal">
                    {user.name}
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
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.active
                          ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                          : "bg-gray-100 text-gray-500 ring-1 ring-gray-400/20"
                      }`}
                    >
                      {user.active ? "Active" : "Inactive"}
                    </span>
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
    </div>
  );
}