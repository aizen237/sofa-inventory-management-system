package com.sofacompany.sofa_backend.controller;

import com.sofacompany.sofa_backend.dto.AuditLogResponse;
import com.sofacompany.sofa_backend.entity.User;
import com.sofacompany.sofa_backend.repository.UserRepository;
import com.sofacompany.sofa_backend.service.AuditLogService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/audit-logs")
public class AuditLogController {

    private final AuditLogService auditLogService;
    private final UserRepository userRepository;

    public AuditLogController(AuditLogService auditLogService, UserRepository userRepository) {
        this.auditLogService = auditLogService;
        this.userRepository = userRepository;
    }

    @GetMapping
    @PreAuthorize("hasRole('OWNER')")
    public List<AuditLogResponse> getLogs(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return auditLogService.getLogsForUser(user);
    }
}