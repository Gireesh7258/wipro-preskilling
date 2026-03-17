package com.myfinbank.owner_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "loans")
@Data
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; 
    
    private String loanType; // Added this to fix the "General" issue
    
    private Double principal; // This matches your "Amount"
    
    private Double interestRate; 
    
    private Integer tenure; 
    
    private String status = "PENDING"; 
    
    private Double calculatedEmi;
}