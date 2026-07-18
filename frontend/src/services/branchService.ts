import api from "./api";
import type { Branch } from "../types/branch";

export async function getBranches(): Promise<Branch[]> {
  const response = await api.get<Branch[]>("/branches");
  return response.data;
}

export async function createBranch(name: string, location: string) {
  const response = await api.post<Branch>("/branches", { name, location });
  return response.data;
}

export async function updateBranch(id: number, name: string, location: string) {
  const response = await api.put<Branch>(`/branches/${id}`, { name, location });
  return response.data;
}