package com.wipro.TestingReactiveApp;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.reactive.server.WebTestClient;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
public class ProductControllerTest {

	
	@Autowired
    private WebTestClient webTestClient;

	
	
	
	@Test
	 void testGetStudentSuccess() {

	        webTestClient.get()
	                .uri("/product/101")
	                .exchange()
	                .expectStatus().isOk()
	                .expectBody()
	                .jsonPath("$.id").isEqualTo("101")
	                .jsonPath("$.name").isEqualTo("Laptop");
	    }
	
	@Test
    void testGetStudentNotFound() {
		
		
		webTestClient.get()
        .uri("/product/10")
        .exchange()
        .expectBody()
        .consumeWith(result -> {
            System.out.println(result.getStatus());
            System.out.println(new String(result.getResponseBody()));
        });
		}
    

	
}
