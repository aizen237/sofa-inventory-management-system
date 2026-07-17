import api from "./api";
import type { Branch } from "../types/branch";

export async function getBranches(): Promise<Branch[]> {
  const response = await api.get<Branch[]>("/branches");
  return response.data;
}