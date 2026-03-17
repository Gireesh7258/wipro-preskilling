package com.myfinbank.owner_service.repository;

import com.myfinbank.owner_service.entity.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<LoanApplication, Long> {
    
    // Allows Admin to see all loans for a specific user
    List<LoanApplication> findByUserId(Long userId);
    
    // Allows Admin to filter by status (e.g., find all PENDING loans)
    List<LoanApplication> findByStatus(String status);
}