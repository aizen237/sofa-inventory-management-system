package com.sofacompany.sofa_backend.controller;

import com.sofacompany.sofa_backend.dto.ChangePasswordRequest;
import com.sofacompany.sofa_backend.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/account")
public class AccountController {
    private final UserService userService;

    public AccountController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/change-password")
    public void changePassword(@RequestBody ChangePasswordRequest request, Authentication authentication) {
        userService.changePassword(authentication.getName(), request);
    }
}