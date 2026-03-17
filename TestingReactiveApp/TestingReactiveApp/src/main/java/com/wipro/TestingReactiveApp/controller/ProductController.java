package com.wipro.TestingReactiveApp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.wipro.TestingReactiveApp.model.Product;
import com.wipro.TestingReactiveApp.service.ProductService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/product")
public class ProductController {

	@Autowired
	ProductService service ;
	
	
	@GetMapping("/{id}")
	public Mono<ResponseEntity<Product>> getProduct(@PathVariable int id) {
	    return service.getProduct(id)
	            .map(p-> ResponseEntity.ok(p)).defaultIfEmpty(ResponseEntity.notFound().build());
	}
	
	
}
