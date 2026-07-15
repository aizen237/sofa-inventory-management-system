export interface InventoryItem {
  id: number;
  code: string;
  itemType: "SOFA" | "CHAIR" | "TABLE";
  price: number;
  quantity: number;
  description: string;
  status: "AVAILABLE" | "UNAVAILABLE" | "ARCHIVED";
  branchId: number;
  branchName: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}