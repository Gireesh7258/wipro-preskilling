package com.example.productapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.productapp.model.Product;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByNameContainingIgnoreCase(String name);
}