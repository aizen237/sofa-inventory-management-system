package com.sofacompany.sofa_backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class InventoryItemRequest {
    private String code;
    private String itemType; // "SOFA", "CHAIR", "TABLE"
    private BigDecimal price;
    private Integer quantity;
    private String description;
    private Long branchId;
}