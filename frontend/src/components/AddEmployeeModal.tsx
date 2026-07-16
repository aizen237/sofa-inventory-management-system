import { useState } from "react";
import { createUser } from "../services/userService.ts";
import type { CreateUserResult } from "../types/user";
import { useToastStore } from "../store/toastStore";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddEmployeeModal({ onClose, onSuccess }: Props) {
  const [fullName, setFullName] = useState("");
  const [branchId, setBranchId] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CreateUserResult | null>(null);
  const showToast = useToastStore((state) => state.showToast);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !branchId) {
      setError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await createUser(fullName.trim(), "EMPLOYEE", Number(branchId));
      setResult(data);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to create employee.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleDone() {
  showToast("Employee account created.");
  onSuccess();
  onClose();
}

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {!result ? (
          <>
            <h2 className="font-display text-xl font-semibold text-charcoal mb-1">
              Add New Employee
            </h2>
            <p className="text-graytext text-sm mb-5">
              A username and temporary password will be generated automatically.
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
                  placeholder="e.g. Abebe Kebede"
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
                  <option value="4">Addis Ababa</option>
                  <option value="5">Hawassa</option>
                </select>
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
                  {submitting ? "Creating..." : "Create Employee"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="font-display text-xl font-semibold text-charcoal mb-1">
              Employee Created
            </h2>
            <p className="text-graytext text-sm mb-5">
              Share these credentials with the employee. This password won't be shown again.
            </p>

            <div className="bg-black/[0.03] rounded-lg p-4 space-y-3 mb-5">
              <div>
                <p className="text-xs text-graytext font-medium mb-1">Username</p>
                <p className="font-mono text-sm text-charcoal">{result.username}</p>
              </div>
              <div>
                <p className="text-xs text-graytext font-medium mb-1">Temporary Password</p>
                <p className="font-mono text-sm text-charcoal">{result.temporaryPassword}</p>
              </div>
            </div>

            <button
              onClick={handleDone}
              className="w-full bg-brand hover:bg-brand-dark text-white font-medium text-sm rounded-lg py-2.5 transition-colors"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}