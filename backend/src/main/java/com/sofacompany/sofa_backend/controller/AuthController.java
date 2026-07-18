package com.sofacompany.sofa_backend.controller;

import com.sofacompany.sofa_backend.dto.LoginRequest;
import com.sofacompany.sofa_backend.dto.LoginResponse;
import com.sofacompany.sofa_backend.entity.User;
import com.sofacompany.sofa_backend.repository.UserRepository;
import com.sofacompany.sofa_backend.security.JwtUtil;
import com.sofacompany.sofa_backend.service.AuditLogService;
import com.sofacompany.sofa_backend.service.LoginAttemptService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.sofacompany.sofa_backend.exception.InvalidCredentialsException;
import com.sofacompany.sofa_backend.exception.AccountLockedException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuditLogService auditLogService;
    private final LoginAttemptService loginAttemptService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil, AuditLogService auditLogService,
                          LoginAttemptService loginAttemptService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.auditLogService = auditLogService;
        this.loginAttemptService = loginAttemptService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        if (loginAttemptService.isLocked(request.getEmail())) {
            throw new AccountLockedException(
                    "Too many failed login attempts. Please try again in 15 minutes.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    loginAttemptService.recordFailure(request.getEmail());
                    int remaining = loginAttemptService.getRemainingAttempts(request.getEmail());
                    return new InvalidCredentialsException(
                            remaining > 0
                                    ? "Invalid email or password. " + remaining + " attempt(s) remaining."
                                    : "Invalid email or password.");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            loginAttemptService.recordFailure(request.getEmail());
            int remaining = loginAttemptService.getRemainingAttempts(request.getEmail());
            if (remaining > 0) {
                throw new InvalidCredentialsException(
                        "Invalid email or password. " + remaining + " attempt(s) remaining.");
            } else {
                throw new AccountLockedException(
                        "Too many failed login attempts. Please try again in 15 minutes.");
            }
        }

        if (!user.isActive()) {
            throw new InvalidCredentialsException("Account is disabled");
        }

        loginAttemptService.recordSuccess(request.getEmail());

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().getName(),
                user.getBranch() != null ? user.getBranch().getId() : null
        );

        auditLogService.log(user, "LOGIN", "Authentication", user.getId(), user.getBranch(), "User logged in");

        return new LoginResponse(token, user.getRole().getName(), user.getBranch() != null ? user.getBranch().getId() : null);
    }
}