package com.myfinbank.user_service.controller;

import com.myfinbank.user_service.entity.*;
import com.myfinbank.user_service.service.UserService;
import com.myfinbank.user_service.repository.AccountRepository;
import com.myfinbank.user_service.repository.UserRepository;
import com.myfinbank.user_service.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired private UserService userService;
    @Autowired private UserRepository userRepository;
    @Autowired private AccountRepository accountRepository;
    @Autowired private JwtUtil jwtUtil;

    // --- SPRINT 1: AUTHENTICATION & REGISTRATION ---

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        userService.registerUser(user);
        return ResponseEntity.ok("User Registered Successfully at Markapur Branch!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds) {
        String username = creds.get("username");
        String password = creds.get("password");
        try {
            if (userService.loginUser(username, password)) {
                User user = userService.findByUsername(username);
                String token = jwtUtil.generateToken(user.getUsername());
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("userId", user.getId());
                response.put("name", user.getName()); 
                response.put("message", "Secure Login Success");
                return ResponseEntity.ok(response);
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
        return ResponseEntity.status(401).body("Invalid Credentials");
    }

    // --- SPRINT 2: CORE BANKING (CUSTOMER OPERATIONS) ---

    @GetMapping("/account/{userId}")
    public ResponseEntity<Account> getAccountDetails(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getAccountDetails(userId));
    }

    @GetMapping("/transactions/{userId}")
    public ResponseEntity<List<Transaction>> getTransactionHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getTransactionHistory(userId));
    }

    @PostMapping("/deposit")
    public ResponseEntity<String> deposit(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        Double amount = Double.valueOf(payload.get("amount").toString());
        userService.deposit(userId, amount);
        return ResponseEntity.ok("Deposit Successful.");
    }

    /**
     * Fulfills: User can withdraw money from their main account.
     */
    @PostMapping("/withdraw")
    public ResponseEntity<String> withdraw(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        Double amount = Double.valueOf(payload.get("amount").toString());
        userService.withdraw(userId, amount);
        return ResponseEntity.ok("Withdrawal Successful.");
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transfer(@RequestBody Map<String, Object> payload) {
        Long fromUserId = Long.valueOf(payload.get("fromUserId").toString());
        String toAcc = payload.get("toAccountNumber").toString();
        Double amt = Double.valueOf(payload.get("amount").toString());
        userService.transferFunds(fromUserId, toAcc, amt);
        return ResponseEntity.ok("Transfer Successful.");
    }

    // --- SPRINT 3: WEALTH MANAGEMENT & INVESTMENTS ---

    @PostMapping("/invest")
    public ResponseEntity<String> invest(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            Double amount = Double.valueOf(payload.get("amount").toString());
            String type = payload.get("type").toString();
            userService.createInvestment(userId, amount, type);
            return ResponseEntity.ok("Investment Successful!");
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    /**
     * NEW: Fulfills "Withdraw Investment" requirement.
     * Moves money from the Portfolio back to the Liquid Balance.
     */
    @PostMapping("/invest/liquidate")
    public ResponseEntity<String> liquidateInvestment(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            Double amount = Double.valueOf(payload.get("amount").toString());
            userService.liquidateInvestment(userId, amount);
            return ResponseEntity.ok("Funds moved from Investment to Main Account successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    // --- SPRINT 4: ADMIN ACTIONS (BANKER PORTAL) ---

    @GetMapping("/all-customers")
    public ResponseEntity<List<Map<String, Object>>> getAdminUserDirectory() {
        return ResponseEntity.ok(userService.getAllCustomerDetails());
    }

    @PutMapping("/status/{userId}")
    public ResponseEntity<String> toggleStatus(@PathVariable Long userId, @RequestParam boolean active) {
        userService.updateStatus(userId, active);
        return ResponseEntity.ok("Status successfully modified.");
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userRepository.findById(id).orElseThrow());
    }
}