package com.sofacompany.sofa_backend.controller;

import com.sofacompany.sofa_backend.dto.CreateUserRequest;
import com.sofacompany.sofa_backend.dto.CreateUserResponse;
import com.sofacompany.sofa_backend.service.UserService;
import org.springframework.web.bind.annotation.*;
import com.sofacompany.sofa_backend.dto.UserSummaryResponse;
import java.util.List;
import com.sofacompany.sofa_backend.dto.UpdateUserRequest;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.security.core.Authentication;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public CreateUserResponse createUser(@Valid @RequestBody CreateUserRequest request, Authentication authentication) {
        return userService.createUser(request, authentication.getName());
    }

    @PutMapping("/{id}")
    public UserSummaryResponse updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
        return userService.updateUser(id, request);
    }
    @GetMapping
    public List<UserSummaryResponse> getAllUsers() {
        return userService.getAllUsers();
    }
}