package com.sofacompany.sofa_backend.config;

import com.sofacompany.sofa_backend.entity.Branch;
import com.sofacompany.sofa_backend.entity.Role;
import com.sofacompany.sofa_backend.entity.User;
import com.sofacompany.sofa_backend.repository.BranchRepository;
import com.sofacompany.sofa_backend.repository.RoleRepository;
import com.sofacompany.sofa_backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(RoleRepository roleRepository, BranchRepository branchRepository,
                      UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.branchRepository = branchRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        // Seed roles if they don't exist
        Role ownerRole = roleRepository.findByName("OWNER")
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setName("OWNER");
                    return roleRepository.save(r);
                });

        roleRepository.findByName("EMPLOYEE")
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setName("EMPLOYEE");
                    return roleRepository.save(r);
                });

        // Seed branches if they don't exist
        if (branchRepository.count() == 0) {
            Branch addis = new Branch();
            addis.setName("Addis Ababa");
            addis.setLocation("Addis Ababa, Ethiopia");
            branchRepository.save(addis);

            Branch hawassa = new Branch();
            hawassa.setName("Hawassa");
            hawassa.setLocation("Hawassa, Ethiopia");
            branchRepository.save(hawassa);
        }

        // Seed one Owner account if no users exist yet
        if (userRepository.count() == 0) {
            User owner = new User();
            owner.setName("Owner");
            owner.setEmail("owner@sofacompany.com");
            owner.setPasswordHash(passwordEncoder.encode("ChangeMe123!"));
            owner.setRole(ownerRole);
            owner.setActive(true);
            owner.setMustChangePassword(true);
            userRepository.save(owner);

            System.out.println("=== Seeded owner account: owner@sofacompany.com / ChangeMe123! ===");
        }
    }
}