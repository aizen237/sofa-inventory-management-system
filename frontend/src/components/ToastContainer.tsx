import { CheckCircle2, XCircle, X } from "lucide-react";
import { useToastStore } from "../store/toastStore";

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 w-80">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-2.5 rounded-xl px-4 py-3 shadow-lg border text-sm animate-in fade-in slide-in-from-top-2 ${
            toast.type === "success"
              ? "bg-white border-green-200 text-charcoal"
              : "bg-white border-red-200 text-charcoal"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
          ) : (
            <XCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
          )}
          <p className="flex-1">{toast.message}</p>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-graytext hover:text-charcoal shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}