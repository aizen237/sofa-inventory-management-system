import InventoryTable from "../components/InventoryTable";

export default function ChairsPage() {
  return (
    <InventoryTable
      itemType="CHAIR"
      title="Chair Collection"
      description="Manage and track chairs across all branches."
    />
  );
}