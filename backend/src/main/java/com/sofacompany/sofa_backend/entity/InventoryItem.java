package com.sofacompany.sofa_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items")
@Data
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code; // e.g. BR15, LA34

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemType itemType; // SOFA, CHAIR, TABLE

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer quantity; // current remaining stock

    private String description;

    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemStatus status = ItemStatus.AVAILABLE;

    @Version
    private Long version;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum ItemType {
        SOFA, CHAIR, TABLE
    }

    public enum ItemStatus {
        AVAILABLE, UNAVAILABLE, ARCHIVED
    }
}