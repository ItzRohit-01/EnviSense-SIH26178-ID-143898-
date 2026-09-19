package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.ChangePasswordDTO;
import com.example.demo.dto.UserProfileDTO;
import com.example.demo.service.UserService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    // ================= GET PROFILE =================
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getProfile(Authentication auth) {
        return ResponseEntity.ok(userService.getProfile(auth.getName()));
    }

    // ================= UPDATE PROFILE =================
    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(
            Authentication auth,
            @RequestBody UserProfileDTO dto) {

        return ResponseEntity.ok(
                userService.updateProfile(auth.getName(), dto)
        );
    }

    // ================= CHANGE PASSWORD =================
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            Authentication auth,
            @RequestBody ChangePasswordDTO dto) {

        userService.changePassword(auth.getName(), dto);
        return ResponseEntity.ok("Password updated");
    }

    // ================= UPLOAD IMAGE =================
    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            Authentication auth) {

        String imageUrl = userService.uploadProfileImage(auth.getName(), file);
        return ResponseEntity.ok(imageUrl);
    }
}