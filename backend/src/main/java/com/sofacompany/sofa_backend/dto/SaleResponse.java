package com.sofacompany.sofa_backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class SaleResponse {
    private Long saleId;
    private String itemCode;
    private Integer quantitySold;
    private BigDecimal priceAtSale;
    private Integer remainingQuantity;
    private String itemStatus;
    private LocalDateTime soldAt;
}