package com.wipro.TestingReactiveApp;

import org.junit.jupiter.api.Test;

import com.wipro.TestingReactiveApp.model.Product;
import com.wipro.TestingReactiveApp.service.ProductService;

import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

public class ProoductServiceTest {

	
	ProductService productService = new ProductService();
	
	
	
	
	  @Test
	    void testProductFound() {

	        Mono<Product> productMono = productService.getProduct(101);

	        StepVerifier.create(productMono)
	                .expectNextMatches(product -> 
	                        product.getName().equals("Laptop"))
	                .verifyComplete();
	    }
	  
	  
	  @Test
	    void testProductNotFound() {

	        Mono<Product> productMono = productService.getProduct(200);

	        StepVerifier.create(productMono)
	                .expectError()
	                .verify();
	    }


}
