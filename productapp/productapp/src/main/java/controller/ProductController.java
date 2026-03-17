package com.example.productapp.controller;

import org.springframework.web.bind.annotation.*;
import com.example.productapp.repository.ProductRepository;
import com.example.productapp.model.Product;
import java.util.List;

@CrossOrigin("*")
@RestController
public class ProductController {

    private final ProductRepository repo;

    public ProductController(ProductRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/product")
    public Product addProduct(@RequestBody Product product) {
        return repo.save(product);
    }

    @GetMapping("/product/{id}")
    public Product getById(@PathVariable Long id) {
        return repo.findById(id).orElse(null);
    }

    @GetMapping("/products/search")
    public List<Product> searchByName(@RequestParam String name) {
        return repo.findByNameContainingIgnoreCase(name);
    }

    @PutMapping("/product/{id}")
    public Product updateProduct(@PathVariable Long id,
                                 @RequestBody Product product) {
        product.setProductid(id);
        return repo.save(product);
    }
}