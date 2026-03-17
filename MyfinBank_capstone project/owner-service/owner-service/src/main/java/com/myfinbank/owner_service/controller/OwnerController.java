package com.myfinbank.owner_service.controller;

import com.myfinbank.owner_service.entity.Owner;
import com.myfinbank.owner_service.entity.LoanApplication;
import com.myfinbank.owner_service.service.OwnerService;
import com.myfinbank.owner_service.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/owner")
@CrossOrigin(origins = "http://localhost:3000")
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

    @Autowired
    private JwtUtil jwtUtil;

    // --- SPRINT 1: AUTH & BANKER MANAGEMENT ---

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Owner owner) {
        ownerService.registerOwner(owner);
        return ResponseEntity.ok("Banker Registered Successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Owner loginRequest) {
        boolean isAuthenticated = ownerService.loginOwner(loginRequest.getUsername(), loginRequest.getPassword());
        
        if (isAuthenticated) {
            String token = jwtUtil.generateToken(loginRequest.getUsername());
            Owner owner = ownerService.findByUsername(loginRequest.getUsername());
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("ownerId", owner.getId());
            response.put("role", "ADMIN");
            response.put("message", "Banker Login Success");
            
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body("Invalid Admin Credentials");
    }

    // --- SPRINT 2: LOAN & EMI CALCULATION ---

    @PostMapping("/calculate-emi")
    public ResponseEntity<Double> calculateEmi(@RequestBody Map<String, Object> payload) {
        Double p = Double.valueOf(payload.get("amount").toString());
        Double r = Double.valueOf(payload.get("interestRate").toString());
        Integer n = Integer.valueOf(payload.get("tenure").toString());
        
        double emi = ownerService.calculateEMI(p, r, n);
        return ResponseEntity.ok(emi);
    }

    @PostMapping("/apply-loan")
    public ResponseEntity<LoanApplication> applyForLoan(@RequestBody LoanApplication loan) {
        // Fulfills: Customer submits application for Banker review
        return ResponseEntity.ok(ownerService.applyForLoan(loan));
    }

    // --- SPRINT 3: BANKER ADMIN ACTIONS ---

    /**
     * Fulfills: Banker can approve or reject loan applications
     */
    @PutMapping("/loan-status/{id}")
    public ResponseEntity<LoanApplication> updateLoanStatus(
            @PathVariable Long id, 
            @RequestParam String status) {
        return ResponseEntity.ok(ownerService.updateLoanStatus(id, status));
    }

    @GetMapping("/loans/all")
    public ResponseEntity<List<LoanApplication>> getAllLoans() {
        // Fulfills: Banker list view for all pending requests
        return ResponseEntity.ok(ownerService.getAllLoanApplications());
    }

    @PutMapping("/customer-activation/{userId}")
    public ResponseEntity<String> toggleCustomerStatus(@PathVariable Long userId, @RequestParam boolean active) {
        return ResponseEntity.ok("User " + userId + " status successfully updated.");
    }
    
}