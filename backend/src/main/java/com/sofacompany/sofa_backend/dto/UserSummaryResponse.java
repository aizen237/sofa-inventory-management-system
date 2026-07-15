package com.sofacompany.sofa_backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class UserSummaryResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String branchName;
    private boolean active;
}