package com.myfinbank.user_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // Holds the Full Name for the UI greeting
    private String username;
    private String email;
    private String password;
    
    // Fulfills "Admin can manage customer activation"
    private boolean active = true; 
}