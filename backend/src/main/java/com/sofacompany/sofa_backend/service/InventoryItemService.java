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
import com.sofacompany.sofa_backend.dto.SaleRequest;
import com.sofacompany.sofa_backend.dto.SaleResponse;
import com.sofacompany.sofa_backend.entity.SaleRecord;
import com.sofacompany.sofa_backend.repository.SaleRecordRepository;
import org.springframework.transaction.annotation.Transactional;
import com.sofacompany.sofa_backend.dto.SaleHistoryResponse;
import com.sofacompany.sofa_backend.dto.DashboardStatsResponse;
import java.math.BigDecimal;
import java.time.LocalDate;

import java.util.List;

@Service
public class InventoryItemService {

    private final InventoryItemRepository inventoryItemRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final SaleRecordRepository saleRecordRepository;

    public InventoryItemService(InventoryItemRepository inventoryItemRepository,
                                BranchRepository branchRepository,
                                UserRepository userRepository,
                                SaleRecordRepository saleRecordRepository) {
        this.inventoryItemRepository = inventoryItemRepository;
        this.branchRepository = branchRepository;
        this.userRepository = userRepository;
        this.saleRecordRepository = saleRecordRepository;
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

    public InventoryItemResponse updateItem(Long id, InventoryItemRequest request, String requesterEmail) {
        InventoryItem item = inventoryItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isOwner = requester.getRole().getName().equals("OWNER");

        // Branch enforcement: employees can only edit items in their own branch
        if (!isOwner && !item.getBranch().getId().equals(requester.getBranch().getId())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You cannot edit items from another branch");
        }

        // If code is changing, make sure the new code isn't already taken by a different item
        if (!item.getCode().equals(request.getCode()) && inventoryItemRepository.existsByCode(request.getCode())) {
            throw new IllegalArgumentException("An item with this code already exists");
        }

        item.setCode(request.getCode());
        item.setItemType(InventoryItem.ItemType.valueOf(request.getItemType().toUpperCase()));
        item.setPrice(request.getPrice());
        item.setQuantity(request.getQuantity());
        item.setDescription(request.getDescription());
        item.setUpdatedAt(java.time.LocalDateTime.now());

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

    @Transactional
    public SaleResponse sellItem(Long itemId, SaleRequest request, String requesterEmail) {
        InventoryItem item = inventoryItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isOwner = requester.getRole().getName().equals("OWNER");

        if (!isOwner && !item.getBranch().getId().equals(requester.getBranch().getId())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You cannot sell items from another branch");
        }

        if (request.getQuantitySold() == null || request.getQuantitySold() <= 0) {
            throw new IllegalArgumentException("Quantity sold must be greater than zero");
        }

        if (request.getQuantitySold() > item.getQuantity()) {
            throw new IllegalArgumentException(
                    "Cannot sell " + request.getQuantitySold() + " units — only " + item.getQuantity() + " in stock");
        }

        // Subtract stock
        int newQuantity = item.getQuantity() - request.getQuantitySold();
        item.setQuantity(newQuantity);

        // Auto-flip status if sold out
        if (newQuantity == 0) {
            item.setStatus(InventoryItem.ItemStatus.UNAVAILABLE);
        }

        item.setUpdatedAt(java.time.LocalDateTime.now());
        inventoryItemRepository.save(item);

        // Create the permanent sale record
        SaleRecord saleRecord = new SaleRecord();
        saleRecord.setInventoryItem(item);
        saleRecord.setQuantitySold(request.getQuantitySold());
        saleRecord.setPriceAtSale(item.getPrice()); // price at the moment of sale
        saleRecord.setBranch(item.getBranch());
        saleRecord.setSoldBy(requester);
        SaleRecord savedRecord = saleRecordRepository.save(saleRecord);

        return new SaleResponse(
                savedRecord.getId(),
                item.getCode(),
                savedRecord.getQuantitySold(),
                savedRecord.getPriceAtSale(),
                item.getQuantity(),
                item.getStatus().name(),
                savedRecord.getSoldAt()
        );
    }

    public List<SaleHistoryResponse> getSaleHistoryForUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isOwner = user.getRole().getName().equals("OWNER");

        List<SaleRecord> records;

        if (isOwner) {
            records = saleRecordRepository.findAllByOrderBySoldAtDesc();
        } else {
            Long branchId = user.getBranch().getId();
            records = saleRecordRepository.findByBranchIdOrderBySoldAtDesc(branchId);
        }

        return records.stream().map(r -> new SaleHistoryResponse(
                r.getId(),
                r.getInventoryItem().getCode(),
                r.getInventoryItem().getItemType().name(),
                r.getQuantitySold(),
                r.getPriceAtSale(),
                r.getBranch().getName(),
                r.getSoldBy().getName(),
                r.getSoldAt()
        )).toList();
    }

    public DashboardStatsResponse getDashboardStats(String userEmail) {
        List<InventoryItemResponse> items = getItemsForUser(userEmail, null);

        long totalItems = items.stream().mapToLong(InventoryItemResponse::getQuantity).sum();

        BigDecimal totalValue = items.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalSofas = items.stream()
                .filter(i -> i.getItemType().equals("SOFA"))
                .mapToLong(InventoryItemResponse::getQuantity).sum();

        long totalChairs = items.stream()
                .filter(i -> i.getItemType().equals("CHAIR"))
                .mapToLong(InventoryItemResponse::getQuantity).sum();

        long totalTables = items.stream()
                .filter(i -> i.getItemType().equals("TABLE"))
                .mapToLong(InventoryItemResponse::getQuantity).sum();

        List<SaleHistoryResponse> allSales = getSaleHistoryForUser(userEmail);
        LocalDate today = LocalDate.now();
        int soldToday = allSales.stream()
                .filter(s -> s.getSoldAt().toLocalDate().equals(today))
                .mapToInt(SaleHistoryResponse::getQuantitySold)
                .sum();

        return new DashboardStatsResponse(totalItems, totalValue, totalSofas, totalChairs, totalTables, soldToday);
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