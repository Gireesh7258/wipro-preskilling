package com.myfinbank.user_service.repository;

import com.myfinbank.user_service.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // Used to generate transaction statements for a specific account
    List<Transaction> findByAccountIdOrderByTimestampDesc(Long accountId);
}