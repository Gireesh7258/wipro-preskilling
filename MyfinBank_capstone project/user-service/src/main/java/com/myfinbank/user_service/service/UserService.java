package com.myfinbank.user_service.service;

import com.myfinbank.user_service.entity.Account;
import com.myfinbank.user_service.entity.Transaction;
import com.myfinbank.user_service.entity.User;
import com.myfinbank.user_service.exception.InsufficientBalanceException;
import com.myfinbank.user_service.exception.UserNotFoundException;
import com.myfinbank.user_service.repository.AccountRepository;
import com.myfinbank.user_service.repository.TransactionRepository;
import com.myfinbank.user_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // --- SPRINT 1: AUTHENTICATION & REGISTRATION ---

    @Transactional
    public User registerUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already taken!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActive(true); 
        User savedUser = userRepository.save(user);
        createAccount(savedUser.getId());
        return savedUser;
    }

    public boolean loginUser(String username, String password) {
        User user = findByUsername(username);
        if (!user.isActive()) {
            throw new RuntimeException("Account suspended. Contact Markapur Branch.");
        }
        return passwordEncoder.matches(password, user.getPassword());
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
    }

    // --- SPRINT 2: CORE BANKING OPERATIONS ---

    private void createAccount(Long userId) {
        Account account = new Account();
        account.setUserId(userId);
        account.setAccountNumber("MFB-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        account.setBalance(0.0);
        account.setInvestmentBalance(0.0);
        account.setInvestmentType("None"); 
        accountRepository.save(account);
    }

    @Transactional
    public void deposit(Long userId, Double amount) {
        Account account = accountRepository.findByUserId(userId)
                .orElseThrow(() -> new UserNotFoundException("Account missing."));
        account.setBalance(account.getBalance() + amount);
        accountRepository.save(account);
        saveTransaction(account.getId(), amount, "DEPOSIT", "Online Portal Deposit");
    }

    /**
     * Fulfills: User can withdraw money from their main account.
     * Requirement: Admin receives notification if balance reaches zero.
     */
    @Transactional
    public void withdraw(Long userId, Double amount) {
        Account account = accountRepository.findByUserId(userId)
                .orElseThrow(() -> new UserNotFoundException("Account not found"));

        if (account.getBalance() < amount) {
            throw new InsufficientBalanceException("Low funds. Available: ₹" + account.getBalance());
        }

        account.setBalance(account.getBalance() - amount);
        accountRepository.save(account);

        // REQUIREMENT: Admin notification
        if (account.getBalance() == 0) {
            System.out.println("ALERT [ADMIN]: Customer ID " + userId + " reached ZERO balance.");
        }

        saveTransaction(account.getId(), amount, "WITHDRAWAL", "Portal Cash Withdrawal");
    }

    @Transactional
    public void transferFunds(Long fromUserId, String toAccountNumber, Double amount) {
        Account fromAcc = accountRepository.findByUserId(fromUserId).orElseThrow();
        Account toAcc = accountRepository.findByAccountNumber(toAccountNumber)
                .orElseThrow(() -> new UserNotFoundException("Recipient " + toAccountNumber + " not found"));

        if (fromAcc.getBalance() < amount) {
            throw new InsufficientBalanceException("Transfer failed: Insufficient balance.");
        }

        fromAcc.setBalance(fromAcc.getBalance() - amount);
        toAcc.setBalance(toAcc.getBalance() + amount);

        accountRepository.save(fromAcc);
        accountRepository.save(toAcc);

        if (fromAcc.getBalance() == 0) {
            System.out.println("ALERT [ADMIN]: Account " + fromAcc.getAccountNumber() + " reached ZERO balance.");
        }

        saveTransaction(fromAcc.getId(), amount, "TRANSFER_DEBIT", "Sent to " + toAccountNumber);
        saveTransaction(toAcc.getId(), amount, "TRANSFER_CREDIT", "Received from " + fromAcc.getAccountNumber());
    }

    // --- SPRINT 3: WEALTH MANAGEMENT & INVESTMENTS ---

    @Transactional
    public void createInvestment(Long userId, Double amount, String type) {
        Account account = accountRepository.findByUserId(userId)
                .orElseThrow(() -> new UserNotFoundException("Account missing for user: " + userId));

        if (account.getBalance() < amount) {
            throw new InsufficientBalanceException("Insufficient Balance: Cannot allocate ₹" + amount + " to " + type);
        }

        account.setBalance(account.getBalance() - amount);
        account.setInvestmentBalance(account.getInvestmentBalance() + amount);
        account.setInvestmentType(type); 

        accountRepository.save(account);
        saveTransaction(account.getId(), amount, "INVEST_ALLOCATION", "Category: " + type);
    }

    /**
     * NEW: Fulfills "Withdraw Investment" requirement.
     * Liquidates investment and moves funds back to the main balance.
     */
    @Transactional
    public void liquidateInvestment(Long userId, Double amount) {
        Account account = accountRepository.findByUserId(userId)
                .orElseThrow(() -> new UserNotFoundException("Investment records missing."));

        if (account.getInvestmentBalance() < amount) {
            throw new InsufficientBalanceException("Liquidation Failed: Not enough funds in " + account.getInvestmentType());
        }

        // 1. Logic: Move the money in the Database
        account.setInvestmentBalance(account.getInvestmentBalance() - amount);
        account.setBalance(account.getBalance() + amount);

        // 2. Reset type if portfolio is empty
        String type = account.getInvestmentType();
        if (account.getInvestmentBalance() == 0) {
            account.setInvestmentType("None");
        }

        accountRepository.save(account);

        // 3. AUDIT TRAIL: Log the "Out" from Investment
        saveTransaction(account.getId(), amount, "INVEST_WITHDRAW", "Sold units from " + type);

        // 4. AUDIT TRAIL: Log the "In" to Main Account (This is the missing row!)
        saveTransaction(account.getId(), amount, "INVEST_LIQUID_CREDIT", "Portfolio funds added to Main Balance");
    }

    // --- SPRINT 4: ADMIN DASHBOARD & UTILITIES ---

    public List<Map<String, Object>> getAllCustomerDetails() {
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> {
            Map<String, Object> details = new HashMap<>();
            Optional<Account> accountOpt = accountRepository.findByUserId(user.getId());
            
            details.put("id", user.getId());
            details.put("name", user.getName());
            details.put("active", user.isActive());
            
            if (accountOpt.isPresent()) {
                details.put("accountNumber", accountOpt.get().getAccountNumber());
                details.put("balance", accountOpt.get().getBalance());
                details.put("investAmount", accountOpt.get().getInvestmentBalance());
                details.put("investType", accountOpt.get().getInvestmentType());
            }
            return details;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void updateStatus(Long userId, boolean active) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setActive(active);
        userRepository.save(user);
    }

    private void saveTransaction(Long accountId, Double amount, String type, String desc) {
        Transaction txn = new Transaction();
        txn.setAccountId(accountId);
        txn.setAmount(amount);
        txn.setType(type);
        txn.setDescription(desc);
        txn.setTimestamp(LocalDateTime.now());
        transactionRepository.save(txn);
    }

    public List<Transaction> getTransactionHistory(Long userId) {
        Account account = accountRepository.findByUserId(userId).orElseThrow();
        return transactionRepository.findByAccountIdOrderByTimestampDesc(account.getId());
    }

    public Account getAccountDetails(Long userId) {
        return accountRepository.findByUserId(userId).orElseThrow();
    }
}