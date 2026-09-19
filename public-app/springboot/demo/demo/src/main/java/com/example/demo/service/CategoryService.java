package com.example.demo.service;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.example.demo.model.Category;
import com.example.demo.repository.CategoryRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // ✅ EXISTING (UNCHANGED)
    public Category addCategory(Category category) {
        Objects.requireNonNull(category, "category must not be null");
        return categoryRepository.save(category);
    }

    // ✅ EXISTING (UNCHANGED)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // ✅ EXISTING (UNCHANGED)
    public void deleteCategory(Long id) {
        Objects.requireNonNull(id, "id must not be null");
        categoryRepository.deleteById(id);
    }

    // =========================
    // ✅ NEW ADMIN FEATURES
    // =========================

    // ✅ Get total category count (Admin Dashboard)
    public long getTotalCategories() {
        return categoryRepository.count();
    }

    // ✅ Prevent duplicate category names
    public Category addCategoryWithValidation(Category category) {
        Objects.requireNonNull(category, "category must not be null");

        categoryRepository.findByName(category.getName())
                .ifPresent(c -> {
                    throw new RuntimeException("Category already exists");
                });

        return categoryRepository.save(category);
    }

    // ✅ OPTIONAL: Get categories created by specific admin
    public List<Category> getCategoriesByAdmin(Long adminId) {
        Objects.requireNonNull(adminId, "adminId must not be null");
        return categoryRepository.findByCreatedBy(adminId);
    }
}