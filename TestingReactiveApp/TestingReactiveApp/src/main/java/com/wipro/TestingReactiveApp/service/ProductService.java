package com.wipro.TestingReactiveApp.service;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wipro.TestingReactiveApp.model.Product;
import com.wipro.TestingReactiveApp.repository.ProductRepo;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
	public class ProductService {

	    private Map<Integer, Product> productMap = new HashMap<>();

	    public ProductService() {
	        productMap.put(101, new Product(101, "Laptop", "20000"));
	        productMap.put(102, new Product(102, "Mobile", "50000"));
	    }

	    public Mono<Product> getProduct(int id) {
	        Product product = productMap.get(id);

	        if (product != null) {
	            return Mono.just(product);
	        } else {
	            return Mono.error(new RuntimeException("Product not found"));
	        }
	    }
	    
	   
	}
