package com.sofacompany.sofa_backend.service;

import com.sofacompany.sofa_backend.dto.CreateUserRequest;
import com.sofacompany.sofa_backend.dto.CreateUserResponse;
import com.sofacompany.sofa_backend.entity.Branch;
import com.sofacompany.sofa_backend.entity.Role;
import com.sofacompany.sofa_backend.entity.User;
import com.sofacompany.sofa_backend.repository.BranchRepository;
import com.sofacompany.sofa_backend.repository.RoleRepository;
import com.sofacompany.sofa_backend.repository.UserRepository;
import com.sofacompany.sofa_backend.security.CredentialGenerator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;
    private final CredentialGenerator credentialGenerator;

    public UserService(UserRepository userRepository, RoleRepository roleRepository,
                       BranchRepository branchRepository, PasswordEncoder passwordEncoder,
                       CredentialGenerator credentialGenerator) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.branchRepository = branchRepository;
        this.passwordEncoder = passwordEncoder;
        this.credentialGenerator = credentialGenerator;
    }

    public CreateUserResponse createUser(CreateUserRequest request) {
        Role role = roleRepository.findByName(request.getRoleName())
                .orElseThrow(() -> new RuntimeException("Invalid role: " + request.getRoleName()));

        Branch branch = null;
        if (request.getBranchId() != null) {
            branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> new RuntimeException("Branch not found"));
        }

        String username = credentialGenerator.generateUsername(
                request.getFullName(),
                userRepository::existsByEmail
        );
        String plainPassword = credentialGenerator.generatePassword();

        User user = new User();
        user.setName(request.getFullName());
        user.setEmail(username);
        user.setPasswordHash(passwordEncoder.encode(plainPassword));
        user.setRole(role);
        user.setBranch(branch);
        user.setActive(true);
        user.setMustChangePassword(true);

        userRepository.save(user);

        return new CreateUserResponse(username, plainPassword);
    }
}