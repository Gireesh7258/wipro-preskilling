package com.myfinbank.owner_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
@ComponentScan(basePackages = {"com.myfinbank.owner_service"}) // This forces Spring to find your config
public class OwnerServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OwnerServiceApplication.class, args);
    }
}