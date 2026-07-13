package com.sofacompany.sofa_backend.repository;

import com.sofacompany.sofa_backend.entity.SaleRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaleRecordRepository extends JpaRepository<SaleRecord, Long> {
    List<SaleRecord> findByBranchIdOrderBySoldAtDesc(Long branchId);
    List<SaleRecord> findAllByOrderBySoldAtDesc();
}