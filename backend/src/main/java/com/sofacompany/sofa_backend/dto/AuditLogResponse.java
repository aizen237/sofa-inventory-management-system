package com.sofacompany.sofa_backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AuditLogResponse {
    private Long id;
    private String userName;
    private String action;
    private String entityType;
    private String branchName;
    private String details;
    private LocalDateTime timestamp;
}