package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Product;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByName(String name);

    // 🔥 Get only available products for users
    List<Product> findByStockGreaterThan(int stock);

    // 🔥 Get only active products (for user listing)
    List<Product> findByActiveTrue();

    // 🔥 Get active + in-stock products (BEST for user side)
    List<Product> findByActiveTrueAndStockGreaterThan(int stock);

    // 🔥 Admin: find low stock products (alert)
    List<Product> findByStockLessThan(int stock);

    List<Product> findByCategory_Id(Long categoryId);

}