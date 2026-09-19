package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.config.JwtUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository,
                          JwtUtil jwtUtil,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (user.getEmail() == null || user.getPassword() == null ||
            user.getEmail().isEmpty() || user.getPassword().isEmpty()) {

            return ResponseEntity.badRequest().body("Email & password required");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(User.Role.USER);

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        if (user.getEmail() == null || user.getPassword() == null ||
            user.getEmail().isEmpty() || user.getPassword().isEmpty()) {

            return ResponseEntity.badRequest().body("Email & password required");
        }

        Optional<User> dbUser = userRepository.findByEmail(user.getEmail());

        if (dbUser.isPresent() &&
            passwordEncoder.matches(user.getPassword(), dbUser.get().getPassword())) {

            User foundUser = dbUser.get();

            // 🔥 FIXED LINE (IMPORTANT)
            String token = jwtUtil.generateToken(
                    foundUser.getId(),              // ✅ ADD USER ID
                    foundUser.getEmail(),
                    foundUser.getRole().name()
            );

            return ResponseEntity.ok(token);
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }
} 