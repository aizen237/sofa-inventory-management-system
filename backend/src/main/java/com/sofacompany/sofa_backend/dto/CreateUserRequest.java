package com.sofacompany.sofa_backend.dto;

import lombok.Data;

@Data
public class CreateUserRequest {
    private String fullName;
    private String roleName; // "OWNER" or "EMPLOYEE"
    private Long branchId;   // nullable for OWNER
}