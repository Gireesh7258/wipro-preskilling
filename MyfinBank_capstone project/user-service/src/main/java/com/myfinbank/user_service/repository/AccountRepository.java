package com.myfinbank.user_service.repository;

import com.myfinbank.user_service.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    // Used to find the account for deposits, withdrawals, and transfers
    Optional<Account> findByUserId(Long userId);
    
    // Used to verify if a destination account number exists
    Optional<Account> findByAccountNumber(String accountNumber);
}