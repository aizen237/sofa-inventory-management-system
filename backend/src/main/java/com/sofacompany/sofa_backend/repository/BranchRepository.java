package com.sofacompany.sofa_backend.repository;

import com.sofacompany.sofa_backend.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BranchRepository extends JpaRepository<Branch, Long> {
}