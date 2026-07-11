package com.sofacompany.sofa_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sale_records")
@Data
public class SaleRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItem inventoryItem;

    @Column(nullable = false)
    private Integer quantitySold;

    @Column(nullable = false)
    private BigDecimal priceAtSale; // price at the moment of sale, not today's price

    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @ManyToOne
    @JoinColumn(name = "sold_by", nullable = false)
    private User soldBy;

    @Column(updatable = false)
    private LocalDateTime soldAt = LocalDateTime.now();
}