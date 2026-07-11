package com.sofacompany.sofa_backend.service;

import com.sofacompany.sofa_backend.dto.BranchRequest;
import com.sofacompany.sofa_backend.entity.Branch;
import com.sofacompany.sofa_backend.exception.ResourceNotFoundException;
import com.sofacompany.sofa_backend.repository.BranchRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BranchService {

    private final BranchRepository branchRepository;

    public BranchService(BranchRepository branchRepository) {
        this.branchRepository = branchRepository;
    }

    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    public Branch createBranch(BranchRequest request) {
        Branch branch = new Branch();
        branch.setName(request.getName());
        branch.setLocation(request.getLocation());
        return branchRepository.save(branch);
    }

    public Branch updateBranch(Long id, BranchRequest request) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
        branch.setName(request.getName());
        branch.setLocation(request.getLocation());
        return branchRepository.save(branch);
    }
}