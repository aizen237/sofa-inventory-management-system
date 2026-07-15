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

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public CreateUserResponse createUser(@RequestBody CreateUserRequest request) {
        return userService.createUser(request);
    }

    @PutMapping("/{id}")
    public UserSummaryResponse updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        return userService.updateUser(id, request);
    }
    @GetMapping
    public List<UserSummaryResponse> getAllUsers() {
        return userService.getAllUsers();
    }
}