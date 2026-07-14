import api from "./api";

export interface LoginResponse {
  token: string;
  role: string;
  branchId: number | null;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", { email, password });
  return response.data;
}