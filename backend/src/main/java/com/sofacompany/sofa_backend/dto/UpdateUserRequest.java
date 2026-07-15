package com.sofacompany.sofa_backend.dto;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String fullName;
    private Long branchId;
    private boolean active;
}