package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Category;
import com.example.demo.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // =========================
    // ✅ EXISTING USER FEATURES (UNCHANGED)
    // =========================

    // ADD CATEGORY (USER)
    @PostMapping
    public Category addCategory(@RequestBody Category category) {
        return categoryService.addCategory(category);
    }

    // GET ALL
    @GetMapping
    public List<Category> getAll() {
        return categoryService.getAllCategories();
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return "Deleted successfully";
    }

    // =========================
    // ✅ NEW ADMIN FEATURES
    // =========================

    // ✅ ADMIN ADD CATEGORY (with duplicate check)
    @PostMapping("/admin")
    public Category addCategoryByAdmin(@RequestBody Category category) {
        return categoryService.addCategoryWithValidation(category);
    }

    // ✅ GET TOTAL CATEGORY COUNT (Admin Dashboard)
    @GetMapping("/count")
    public long getTotalCategories() {
        return categoryService.getTotalCategories();
    }

    // ✅ OPTIONAL: GET categories by admin
    @GetMapping("/admin/{adminId}")
    public List<Category> getCategoriesByAdmin(@PathVariable Long adminId) {
        return categoryService.getCategoriesByAdmin(adminId);
    }
}