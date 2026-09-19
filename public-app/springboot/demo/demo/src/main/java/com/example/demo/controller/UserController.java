package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.User;
import com.example.demo.model.User.Role;
import com.example.demo.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ================= USER REGISTER =================
    @PostMapping("/user/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {

        if (user.getEmail() == null || user.getEmail().isEmpty() ||
            user.getPassword() == null || user.getPassword().isEmpty()) {

            return ResponseEntity.badRequest().body("Email and password are required");
        }

        User savedUser = userService.register(user, Role.USER);
        savedUser.setPassword(null);

        return ResponseEntity.ok(savedUser);
    }

    // ================= ADMIN REGISTER =================
    @PostMapping("/admin/register")
    public ResponseEntity<?> registerAdmin(@RequestBody User user) {

        if (user.getEmail() == null || user.getEmail().isEmpty() ||
            user.getPassword() == null || user.getPassword().isEmpty()) {

            return ResponseEntity.badRequest().body("Email and password are required");
        }

        User savedAdmin = userService.register(user, Role.ADMIN);
        savedAdmin.setPassword(null);

        return ResponseEntity.ok(savedAdmin);
    }
}