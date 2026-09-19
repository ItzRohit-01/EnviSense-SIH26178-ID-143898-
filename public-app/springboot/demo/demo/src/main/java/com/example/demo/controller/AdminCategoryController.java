package com.example.demo.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Category;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CategoryService;

@RestController
@RequestMapping("/api/admin/categories")
public class AdminCategoryController {

    private final CategoryService categoryService;
    private final UserRepository userRepository;

    public AdminCategoryController(CategoryService categoryService, UserRepository userRepository) {
        this.categoryService = categoryService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public Category addCategory(@RequestBody Category category, Authentication authentication) {
        category.setCreatedBy(getLoggedInUserId(authentication));
        return categoryService.addCategory(category);
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @PutMapping("/{id}")
    public Category updateCategory(
            @PathVariable Long id,
            @RequestBody Category category,
            Authentication authentication) {
        category.setId(id);
        category.setCreatedBy(getLoggedInUserId(authentication));
        return categoryService.addCategory(category);
    }

    @DeleteMapping("/{id}")
    public String deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return "Deleted successfully";
    }

    @GetMapping("/count")
    public long getTotalCategories() {
        return categoryService.getTotalCategories();
    }

    @GetMapping("/admin/{adminId}")
    public List<Category> getCategoriesByAdmin(@PathVariable Long adminId) {
        return categoryService.getCategoriesByAdmin(adminId);
    }

    private Long getLoggedInUserId(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Missing authenticated admin");
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated admin not found"));

        return user.getId();
    }
}
