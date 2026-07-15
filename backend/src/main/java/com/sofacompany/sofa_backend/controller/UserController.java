package com.sofacompany.sofa_backend.controller;

import com.sofacompany.sofa_backend.dto.CreateUserRequest;
import com.sofacompany.sofa_backend.dto.CreateUserResponse;
import com.sofacompany.sofa_backend.service.UserService;
import org.springframework.web.bind.annotation.*;
import com.sofacompany.sofa_backend.dto.UserSummaryResponse;
import java.util.List;

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
    @GetMapping
    public List<UserSummaryResponse> getAllUsers() {
        return userService.getAllUsers();
    }
}