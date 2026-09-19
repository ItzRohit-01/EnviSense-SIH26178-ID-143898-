package com.example.demo.repository;

import java.util.List;

import com.example.demo.model.CartItem;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface CartRepository extends JpaRepository<CartItem, Long> {

    @Query("SELECT c FROM CartItem c JOIN FETCH c.product WHERE c.user.id = :userId")
    List<CartItem> findByUser_Id(@Param("userId") Long userId);
    int countByUserId(Long userId);
}