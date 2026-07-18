import { useState } from "react";
import { createBranch, updateBranch } from "../services/branchService";
import type { Branch } from "../types/branch";
import { useToastStore } from "../store/toastStore";

interface Props {
  branch: Branch | null; // null = creating new, otherwise editing
  onClose: () => void;
  onSuccess: () => void;
}

export default function BranchModal({ branch, onClose, onSuccess }: Props) {
  const [name, setName] = useState(branch?.name ?? "");
  const [location, setLocation] = useState(branch?.location ?? "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const showToast = useToastStore((state) => state.showToast);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !location.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      if (branch) {
        await updateBranch(branch.id, name.trim(), location.trim());
        showToast(`${name.trim()} updated successfully.`);
      } else {
        await createBranch(name.trim(), location.trim());
        showToast(`${name.trim()} added successfully.`);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to save branch.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="font-display text-xl font-semibold text-charcoal mb-1">
          {branch ? "Edit Branch" : "Add New Branch"}
        </h2>
        <p className="text-graytext text-sm mb-5">
          {branch ? `Update details for ${branch.name}.` : "Enter the details for this branch."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-graytext mb-1.5">
              Branch Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bahir Dar Lehulu"
              className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-graytext mb-1.5">
              Location *
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bahir Dar, Ethiopia"
              className="w-full border border-black/10 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
            />
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
              {submitting ? "Saving..." : branch ? "Save Changes" : "Add Branch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}