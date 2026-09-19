package com.example.demo.repository;

import com.example.demo.model.OrderTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<OrderTable, Long> {

    // ✅ Get all orders of a user
    List<OrderTable> findByUser_Id(Long userId);

    // ✅ Get single order with user + items
    @Query("SELECT o FROM OrderTable o JOIN FETCH o.user LEFT JOIN FETCH o.items WHERE o.id = :id")
    Optional<OrderTable> findByIdWithUser(@Param("id") Long id);
}