package com.sofacompany.sofa_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class InventoryItemRequest {

    @NotBlank(message = "Code is required")
    private String code;

    @NotBlank(message = "Item type is required")
    private String itemType;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than zero")
    private BigDecimal price;

    @NotNull(message = "Quantity is required")
    @PositiveOrZero(message = "Quantity cannot be negative")
    private Integer quantity;

    private String description;

    private Long branchId;
}