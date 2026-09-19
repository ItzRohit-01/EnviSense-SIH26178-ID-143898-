package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.ChangePasswordDTO;
import com.example.demo.dto.UserProfileDTO;
import com.example.demo.service.UserService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminProfileController {

    private final UserService adminService;

    public AdminProfileController(UserService adminService) {
        this.adminService = adminService;
    }

    // ================= GET ADMIN PROFILE =================
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getProfile(Authentication auth) {
        return ResponseEntity.ok(
                adminService.getProfile(auth.getName())
        );
    }

    // ================= UPDATE ADMIN PROFILE =================
    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(
            Authentication auth,
            @RequestBody UserProfileDTO dto) {

        return ResponseEntity.ok(
                adminService.updateProfile(auth.getName(), dto)
        );
    }

    // ================= CHANGE ADMIN PASSWORD =================
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            Authentication auth,
            @RequestBody ChangePasswordDTO dto) {

        adminService.changePassword(auth.getName(), dto);
        return ResponseEntity.ok("Password updated");
    }

    // ================= UPLOAD ADMIN IMAGE =================
    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file,
            Authentication auth) {

        String imageUrl = adminService.uploadProfileImage(auth.getName(), file);
        return ResponseEntity.ok(imageUrl);
    }
}