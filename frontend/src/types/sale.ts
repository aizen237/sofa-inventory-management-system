export interface SaleHistoryEntry {
  saleId: number;
  itemCode: string;
  itemType: string;
  quantitySold: number;
  priceAtSale: number;
  branchName: string;
  soldByName: string;
  soldAt: string;
}