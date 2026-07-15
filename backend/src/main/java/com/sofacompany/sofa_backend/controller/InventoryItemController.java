package com.sofacompany.sofa_backend.controller;

import com.sofacompany.sofa_backend.dto.InventoryItemRequest;
import com.sofacompany.sofa_backend.dto.InventoryItemResponse;
import com.sofacompany.sofa_backend.service.InventoryItemService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.sofacompany.sofa_backend.dto.SaleRequest;
import com.sofacompany.sofa_backend.dto.SaleResponse;
import com.sofacompany.sofa_backend.dto.SaleHistoryResponse;
import java.util.List;
import com.sofacompany.sofa_backend.dto.DashboardStatsResponse;

@RestController
@RequestMapping("/items")
public class InventoryItemController {

    private final InventoryItemService inventoryItemService;

    public InventoryItemController(InventoryItemService inventoryItemService) {
        this.inventoryItemService = inventoryItemService;
    }

    @PostMapping
    public InventoryItemResponse createItem(@RequestBody InventoryItemRequest request, Authentication authentication) {
        String email = authentication.getName();
        return inventoryItemService.createItem(request, email);
    }

    @GetMapping
    public List<InventoryItemResponse> getItems(@RequestParam(required = false) String itemType,
                                                Authentication authentication) {
        String email = authentication.getName();
        return inventoryItemService.getItemsForUser(email, itemType);
    }

    @PutMapping("/{id}")
    public InventoryItemResponse updateItem(@PathVariable Long id,
                                            @RequestBody InventoryItemRequest request,
                                            Authentication authentication) {
        String email = authentication.getName();
        return inventoryItemService.updateItem(id, request, email);
    }

    @GetMapping("/history")
    public List<SaleHistoryResponse> getSaleHistory(Authentication authentication) {
        String email = authentication.getName();
        return inventoryItemService.getSaleHistoryForUser(email);
    }

    @GetMapping("/stats")
    public DashboardStatsResponse getStats(Authentication authentication) {
        String email = authentication.getName();
        return inventoryItemService.getDashboardStats(email);
    }

    @PostMapping("/{id}/sell")
    public SaleResponse sellItem(@PathVariable Long id,
                                 @RequestBody SaleRequest request,
                                 Authentication authentication) {
        String email = authentication.getName();
        return inventoryItemService.sellItem(id, request, email);
    }
}