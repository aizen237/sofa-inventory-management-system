package com.sofacompany.sofa_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BranchRequest {

    @NotBlank(message = "Branch name is required")
    private String name;

    @NotBlank(message = "Location is required")
    private String location;
}