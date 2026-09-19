package com.example.demo.repository;

import com.example.demo.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    // ✅ Get total category count (used in admin dashboard)
    long count();

    // ✅ OPTIONAL: Find categories created by specific admin
    List<Category> findByCreatedBy(Long adminId);

    // ✅ OPTIONAL: Prevent duplicate category names
    Optional<Category> findByName(String name);
}