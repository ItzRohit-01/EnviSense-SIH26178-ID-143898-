package com.example.demo.service;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Objects;
import java.nio.file.Path;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.ChangePasswordDTO;
import com.example.demo.dto.UserProfileDTO;
import com.example.demo.model.User;
import com.example.demo.model.User.Role;
import com.example.demo.repository.UserRepository;
import org.springframework.security.core.Authentication;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final Cloudinary cloudinary;

    public UserService(UserRepository userRepo,
                   PasswordEncoder passwordEncoder,
                   Cloudinary cloudinary) {
    this.userRepo = userRepo;
    this.passwordEncoder = passwordEncoder;
    this.cloudinary = cloudinary;
}

    // =========================
    // REGISTER USER / ADMIN
    // =========================
    public User register(User user, Role role) {

        if (user == null) {
            throw new RuntimeException("User cannot be null");
        }

        if (user.getEmail() == null || user.getPassword() == null) {
            throw new RuntimeException("Email and password are required");
        }

        if (userRepo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        // FORCE ROLE FROM BACKEND
        user.setRole(role);

        // ENCRYPT PASSWORD
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepo.save(user);
    }

    // =========================
    // LOGIN
    // =========================
    public User login(String email, String password) {

    if (email == null || email.trim().isEmpty() ||
        password == null || password.trim().isEmpty()) {
        throw new RuntimeException("Email and password required");
    }

    User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!passwordEncoder.matches(password, user.getPassword())) {
        throw new RuntimeException("Invalid password");
    }

    return user;
}

    // =========================
    // GET USER BY ID
    // =========================
    public User getUserById(Long id) {

        Objects.requireNonNull(id, "User ID must not be null");

        return userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // =========================
    // DELETE USER
    // =========================
    public String deleteUser(Long id) {

        Objects.requireNonNull(id, "User ID must not be null");

        if (!userRepo.existsById(id)) {
            return "User not found";
        }

        userRepo.deleteById(id);
        return "User deleted successfully";
    }

  public UserProfileDTO getProfile(String email) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserProfileDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getPhone(),
                user.getAddress(),
                user.getCity(),
                user.getCountry(),
                user.getProfileImage() // full URL
        );
    }

    // ================= PROFILE UPDATE =================
    public UserProfileDTO updateProfile(String email, UserProfileDTO dto) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getAddress() != null) user.setAddress(dto.getAddress());
        if (dto.getCity() != null) user.setCity(dto.getCity());
        if (dto.getCountry() != null) user.setCountry(dto.getCountry());

        userRepo.save(user);

        return getProfile(email);
    }

    // ================= CHANGE PASSWORD =================
    public void changePassword(String email, ChangePasswordDTO dto) {

        if (dto.getOldPassword() == null || dto.getNewPassword() == null) {
            throw new RuntimeException("Passwords required");
        }

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password incorrect");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepo.save(user);
    }

    // ================= IMAGE UPLOAD (Cloudinary) =================
    public String uploadProfileImage(String email, MultipartFile file) {

        try {
            if (file == null || file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }

            if (!file.getContentType().startsWith("image/")) {
                throw new RuntimeException("Only image files allowed");
            }

            User user = userRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", "profile_images")
            );

            String imageUrl = uploadResult.get("secure_url").toString();

            user.setProfileImage(imageUrl);
            userRepo.save(user);

            return imageUrl;

        } catch (Exception e) {
            throw new RuntimeException("Image upload failed");
        }
    }
}