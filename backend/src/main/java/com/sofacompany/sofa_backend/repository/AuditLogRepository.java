package com.sofacompany.sofa_backend.repository;

import com.sofacompany.sofa_backend.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findAllByOrderByTimestampDesc();
    List<AuditLog> findByBranchIdOrderByTimestampDesc(Long branchId);
}