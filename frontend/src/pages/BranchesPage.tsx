import { useEffect, useState } from "react";
import { getBranches } from "../services/branchService";
import type { Branch } from "../types/branch";
import BranchModal from "../components/BranchModal";
import { Plus, Search, Pencil, Building2, MapPin } from "lucide-react";

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBranches = branches.filter((b) => {
    const q = searchQuery.toLowerCase();
    return b.name.toLowerCase().includes(q) || b.location.toLowerCase().includes(q);
  });

  async function loadBranches() {
    setLoading(true);
    setError("");
    try {
      const data = await getBranches();
      setBranches(data);
    } catch {
      setError("Failed to load branches.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
    loadBranches();
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
            <Building2 size={22} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-charcoal">
              Branches
            </h1>
            <p className="text-graytext text-sm mt-0.5">
              Manage store locations.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-brand hover:bg-brand-dark text-white font-medium text-sm rounded-lg px-4 py-2.5 shadow-sm shadow-brand/30 transition-all hover:shadow-md"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add Branch
        </button>
      </div>

      <div className="bg-white rounded-xl border border-black/10 p-4 flex items-center gap-3 mb-4 max-w-xs">
        <div className="bg-brand/10 text-brand rounded-lg p-2.5 shrink-0">
          <Building2 size={18} />
        </div>
        <div>
          <p className="text-xs text-graytext font-medium">Total Branches</p>
          <p className="font-display text-lg font-semibold text-charcoal leading-tight">
            {branches.length}
          </p>
        </div>
      </div>

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
            placeholder="Search by name or location..."
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
                <th className="px-5 py-3.5 font-semibold">Location</th>
                <th className="px-5 py-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBranches.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-12 text-center text-graytext">
                    {branches.length === 0
                      ? "No branches found."
                      : "No branches match your search."}
                  </td>
                </tr>
              )}
              {filteredBranches.map((branch) => (
                <tr
                  key={branch.id}
                  className="border-b border-black/5 last:border-0 hover:bg-black/[0.015] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                        <Building2 size={16} />
                      </div>
                      <span className="font-semibold text-charcoal">
                        {branch.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 text-graytext">
                      <MapPin size={13} />
                      {branch.location}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setEditingBranch(branch)}
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
        <BranchModal
          branch={null}
          onClose={() => setShowAddModal(false)}
          onSuccess={loadBranches}
        />
      )}

      {editingBranch && (
        <BranchModal
          branch={editingBranch}
          onClose={() => setEditingBranch(null)}
          onSuccess={loadBranches}
        />
      )}
    </div>
  );
}