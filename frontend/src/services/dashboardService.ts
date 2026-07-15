import api from "./api";
import type { DashboardStats } from "../types/dashboard";

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<DashboardStats>("/items/stats");
  return response.data;
}