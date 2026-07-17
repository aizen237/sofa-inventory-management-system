import { useState, useEffect } from "react";
import { updateUser } from "../services/userService";
import type { UserSummary } from "../types/user";
import { useToastStore } from "../store/toastStore";
import { getBranches } from "../services/branchService";
import type { Branch } from "../types/branch";

interface Props {
  user: UserSummary;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditUserModal({ user, onClose, onSuccess }: Props) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [fullName, setFullName] = useState(user.name);
  const [branchId, setBranchId] = useState("");
  const [active, setActive] = useState(user.active);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    getBranches().then((data) => {
      setBranches(data);
      const currentBranch = data.find((b) => b.name === user.branchName);
      if (currentBranch) {
        setBranchId(String(currentBranch.id));
      }
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !branchId) {
      setError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      await updateUser(user.id, fullName.trim(), Number(branchId), active);
      showToast(`${fullName.trim()} updated successfully.`);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to update employee.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="font-display text-xl font-semibold text-charcoal mb-1">
          Edit Employee
        </h2>
        <p className="text-graytext text-sm mb-5">
          Update details for {user.name}.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-graytext mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-graytext mb-1.5">
              Assigned Branch *
            </label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand bg-white"
            >
              <option value="">Select branch</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-4 h-4 accent-brand"
            />
            <label htmlFor="active" className="text-sm text-charcoal">
              Account active
            </label>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-black/10 text-charcoal font-medium text-sm rounded-lg py-2.5 hover:bg-black/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-brand hover:bg-brand-dark text-white font-medium text-sm rounded-lg py-2.5 transition-colors disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}