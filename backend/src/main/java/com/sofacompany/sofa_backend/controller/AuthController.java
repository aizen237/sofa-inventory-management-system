package com.sofacompany.sofa_backend.controller;

import com.sofacompany.sofa_backend.dto.LoginRequest;
import com.sofacompany.sofa_backend.dto.LoginResponse;
import com.sofacompany.sofa_backend.entity.User;
import com.sofacompany.sofa_backend.repository.UserRepository;
import com.sofacompany.sofa_backend.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.sofacompany.sofa_backend.exception.InvalidCredentialsException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new InvalidCredentialsException("Account is disabled");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().getName(),
                user.getBranch() != null ? user.getBranch().getId() : null
        );

        return new LoginResponse(token, user.getRole().getName(), user.getBranch() != null ? user.getBranch().getId() : null);
    }
}