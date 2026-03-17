package com.myfinbank.user_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String accountNumber;
    private Double balance = 0.0;
    
    // Use these exact names for consistency
    private Double investmentBalance = 0.0;
    private String investmentType; 

    // If you are using Lombok's @Data, you don't need manual getters/setters.
    // But if you keep them, make sure the variable names match:
    public String getInvestmentType() { return investmentType; }
    public void setInvestmentType(String investmentType) { this.investmentType = investmentType; }
}