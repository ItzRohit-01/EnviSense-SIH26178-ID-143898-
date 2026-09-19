package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email (used in login)
    Optional<User> findByEmail(String email);

    // Check duplicate email (used in register)
    boolean existsByEmail(String email);
}