package com.sofacompany.sofa_backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class SaleRequest {

    @NotNull(message = "Quantity sold is required")
    @Positive(message = "Quantity sold must be greater than zero")
    private Integer quantitySold;
}