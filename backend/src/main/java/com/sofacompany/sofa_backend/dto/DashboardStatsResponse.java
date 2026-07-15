package com.sofacompany.sofa_backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalItems;
    private BigDecimal totalValue;
    private long totalSofas;
    private long totalChairs;
    private long totalTables;
    private int itemsSoldToday;
}