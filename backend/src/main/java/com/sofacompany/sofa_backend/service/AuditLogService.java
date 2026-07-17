package com.sofacompany.sofa_backend.service;

import com.sofacompany.sofa_backend.entity.AuditLog;
import com.sofacompany.sofa_backend.entity.Branch;
import com.sofacompany.sofa_backend.entity.User;
import com.sofacompany.sofa_backend.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import com.sofacompany.sofa_backend.dto.AuditLogResponse;
import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public List<AuditLogResponse> getLogsForUser(User user) {
        boolean isOwner = user.getRole().getName().equals("OWNER");

        List<AuditLog> logs;
        if (isOwner) {
            logs = auditLogRepository.findAllByOrderByTimestampDesc();
        } else {
            logs = auditLogRepository.findByBranchIdOrderByTimestampDesc(user.getBranch().getId());
        }

        return logs.stream().map(l -> new AuditLogResponse(
                l.getId(),
                l.getUser() != null ? l.getUser().getName() : "System",
                l.getAction(),
                l.getEntityType(),
                l.getBranch() != null ? l.getBranch().getName() : "—",
                l.getDetails(),
                l.getTimestamp()
        )).toList();
    }

    public void log(User user, String action, String entityType, Long entityId, Branch branch, String details) {
        AuditLog entry = new AuditLog();
        entry.setUser(user);
        entry.setAction(action);
        entry.setEntityType(entityType);
        entry.setEntityId(entityId);
        entry.setBranch(branch);
        entry.setDetails(details);
        auditLogRepository.save(entry);
    }
}