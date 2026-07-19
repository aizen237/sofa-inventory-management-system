package com.sofacompany.sofa_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateUserRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Role is required")
    private String roleName;

    private Long branchId;
}