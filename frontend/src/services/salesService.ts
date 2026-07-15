import api from "./api";
import type { SaleHistoryEntry } from "../types/sale";

export async function getSaleHistory(): Promise<SaleHistoryEntry[]> {
  const response = await api.get<SaleHistoryEntry[]>("/items/history");
  return response.data;
}