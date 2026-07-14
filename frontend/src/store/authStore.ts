import { create } from "zustand";

interface AuthState {
  token: string | null;
  role: string | null;
  branchId: number | null;
  setAuth: (token: string, role: string, branchId: number | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role"),
  branchId: localStorage.getItem("branchId")
    ? Number(localStorage.getItem("branchId"))
    : null,

  setAuth: (token, role, branchId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    if (branchId !== null) localStorage.setItem("branchId", String(branchId));
    set({ token, role, branchId });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("branchId");
    set({ token: null, role: null, branchId: null });
  },
}));