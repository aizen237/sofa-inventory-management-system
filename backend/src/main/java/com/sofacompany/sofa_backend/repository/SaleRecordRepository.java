package com.sofacompany.sofa_backend.repository;

import com.sofacompany.sofa_backend.entity.SaleRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRecordRepository extends JpaRepository<SaleRecord, Long> {
}