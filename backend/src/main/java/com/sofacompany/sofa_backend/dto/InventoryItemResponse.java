package com.sofacompany.sofa_backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class InventoryItemResponse {
    private Long id;
    private String code;
    private String itemType;
    private BigDecimal price;
    private Integer quantity;
    private String description;
    private String status;
    private Long branchId;
    private String branchName;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}