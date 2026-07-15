import api from "./api";
import type { InventoryItem } from "../types/inventory";

export async function getItems(itemType?: string): Promise<InventoryItem[]> {
  const response = await api.get<InventoryItem[]>("/items", {
    params: itemType ? { itemType } : {},
  });
  return response.data;
}

export async function sellItem(itemId: number, quantitySold: number) {
  const response = await api.post(`/items/${itemId}/sell`, { quantitySold });
  return response.data;
}