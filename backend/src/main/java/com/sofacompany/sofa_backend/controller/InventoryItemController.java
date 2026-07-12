package com.sofacompany.sofa_backend.controller;

import com.sofacompany.sofa_backend.dto.InventoryItemRequest;
import com.sofacompany.sofa_backend.dto.InventoryItemResponse;
import com.sofacompany.sofa_backend.service.InventoryItemService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}