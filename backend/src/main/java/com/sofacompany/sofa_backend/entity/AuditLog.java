package com.sofacompany.sofa_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // nullable — e.g. a failed login before we know who it is

    @Column(nullable = false)
    private String action; // e.g. "LOGIN", "LOGIN_FAILED", "CREATE_ITEM", "UPDATE_ITEM", "SOLD_ITEM"

    private String entityType; // e.g. "InventoryItem", "User"

    private Long entityId; // the specific record affected

    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch; // nullable

    @Column(length = 1000)
    private String details; // human-readable summary, e.g. "price changed from 500 to 550"

    @Column(updatable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}