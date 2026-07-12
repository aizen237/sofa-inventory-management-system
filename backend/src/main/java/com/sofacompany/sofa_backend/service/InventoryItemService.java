package com.sofacompany.sofa_backend.service;

import com.sofacompany.sofa_backend.dto.InventoryItemRequest;
import com.sofacompany.sofa_backend.dto.InventoryItemResponse;
import com.sofacompany.sofa_backend.entity.Branch;
import com.sofacompany.sofa_backend.entity.InventoryItem;
import com.sofacompany.sofa_backend.entity.User;
import com.sofacompany.sofa_backend.exception.ResourceNotFoundException;
import com.sofacompany.sofa_backend.repository.BranchRepository;
import com.sofacompany.sofa_backend.repository.InventoryItemRepository;
import com.sofacompany.sofa_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryItemService {

    private final InventoryItemRepository inventoryItemRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;

    public InventoryItemService(InventoryItemRepository inventoryItemRepository,
                                BranchRepository branchRepository,
                                UserRepository userRepository) {
        this.inventoryItemRepository = inventoryItemRepository;
        this.branchRepository = branchRepository;
        this.userRepository = userRepository;
    }

    public InventoryItemResponse createItem(InventoryItemRequest request, String creatorEmail) {
        if (inventoryItemRepository.existsByCode(request.getCode())) {
            throw new IllegalArgumentException("An item with this code already exists");
        }

        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));

        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        InventoryItem item = new InventoryItem();
        item.setCode(request.getCode());
        item.setItemType(InventoryItem.ItemType.valueOf(request.getItemType().toUpperCase()));
        item.setPrice(request.getPrice());
        item.setQuantity(request.getQuantity());
        item.setDescription(request.getDescription());
        item.setBranch(branch);
        item.setStatus(InventoryItem.ItemStatus.AVAILABLE);
        item.setCreatedBy(creator);

        InventoryItem saved = inventoryItemRepository.save(item);
        return toResponse(saved);
    }

    public List<InventoryItemResponse> getItemsForUser(String userEmail, String itemType) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isOwner = user.getRole().getName().equals("OWNER");

        List<InventoryItem> items;

        if (isOwner) {
            if (itemType != null) {
                items = inventoryItemRepository.findByItemType(
                        InventoryItem.ItemType.valueOf(itemType.toUpperCase()));
            } else {
                items = inventoryItemRepository.findAll();
            }
        } else {
            Long branchId = user.getBranch().getId();
            if (itemType != null) {
                items = inventoryItemRepository.findByBranchIdAndItemType(
                        branchId, InventoryItem.ItemType.valueOf(itemType.toUpperCase()));
            } else {
                items = inventoryItemRepository.findByBranchId(branchId);
            }
        }

        return items.stream().map(this::toResponse).toList();
    }

    private InventoryItemResponse toResponse(InventoryItem item) {
        return new InventoryItemResponse(
                item.getId(),
                item.getCode(),
                item.getItemType().name(),
                item.getPrice(),
                item.getQuantity(),
                item.getDescription(),
                item.getStatus().name(),
                item.getBranch().getId(),
                item.getBranch().getName(),
                item.getCreatedBy() != null ? item.getCreatedBy().getName() : null,
                item.getCreatedAt(),
                item.getUpdatedAt()
        );
    }
}