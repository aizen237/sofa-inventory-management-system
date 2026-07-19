package com.sofacompany.sofa_backend.controller;

import com.sofacompany.sofa_backend.dto.BranchRequest;
import com.sofacompany.sofa_backend.entity.Branch;
import com.sofacompany.sofa_backend.service.BranchService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/branches")
public class BranchController {

    private final BranchService branchService;

    public BranchController(BranchService branchService) {
        this.branchService = branchService;
    }

    @GetMapping
    public List<Branch> getAllBranches() {
        return branchService.getAllBranches();
    }

    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public Branch createBranch(@Valid @RequestBody BranchRequest request) {
        return branchService.createBranch(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public Branch updateBranch(@RequestParam Long id, @Valid @RequestBody BranchRequest request) {
        return branchService.updateBranch(id, request);
    }
}