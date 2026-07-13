package com.sofacompany.sofa_backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class SaleHistoryResponse {
    private Long saleId;
    private String itemCode;
    private String itemType;
    private Integer quantitySold;
    private BigDecimal priceAtSale;
    private String branchName;
    private String soldByName;
    private LocalDateTime soldAt;
}