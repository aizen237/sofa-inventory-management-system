package com.sofacompany.sofa_backend.repository;

import com.sofacompany.sofa_backend.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findByBranchId(Long branchId);
    List<InventoryItem> findByItemType(InventoryItem.ItemType itemType);
    List<InventoryItem> findByBranchIdAndItemType(Long branchId, InventoryItem.ItemType itemType);
    boolean existsByCode(String code);
}