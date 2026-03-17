package com.myfinbank.owner_service.service;

import com.myfinbank.owner_service.entity.Owner;
import com.myfinbank.owner_service.entity.LoanApplication;
import com.myfinbank.owner_service.repository.OwnerRepository;
import com.myfinbank.owner_service.repository.LoanRepository;
import com.myfinbank.owner_service.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OwnerService {

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // --- Sprint 1: Auth Logic ---

    public Owner registerOwner(Owner owner) {
        owner.setPassword(passwordEncoder.encode(owner.getPassword()));
        return ownerRepository.save(owner);
    }

    public boolean loginOwner(String username, String password) {
        Owner owner = findByUsername(username);
        if (!passwordEncoder.matches(password, owner.getPassword())) {
            throw new UserNotFoundException("Invalid Owner Credentials");
        }
        return true;
    }

    public Owner findByUsername(String username) {
        return ownerRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Owner not found: " + username));
    }

    // --- Sprint 2: Customer Side (EMI & Application) ---

    /**
     * Fulfills "Customer can calculate loan EMI"
     */
    public double calculateEMI(double principal, double annualRate, int months) {
        double monthlyRate = annualRate / (12 * 100);
        return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) 
                / (Math.pow(1 + monthlyRate, months) - 1);
    }

    /**
     * Fulfills "Customer can apply for loans"
     */
    public LoanApplication applyForLoan(LoanApplication loan) {
        // Ensure new applications start as PENDING
        loan.setStatus("PENDING");
        return loanRepository.save(loan); 
    }

    // --- Sprint 2 & 3: Admin Side (Management) ---

    /**
     * Fulfills "Admin can approve or deny loan applications"
     */
    public LoanApplication updateLoanStatus(Long loanId, String status) {
        LoanApplication loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan application not found"));
        
        String upperStatus = status.toUpperCase();
        if (!upperStatus.equals("APPROVED") && !upperStatus.equals("REJECTED")) {
            throw new RuntimeException("Invalid status. Use APPROVED or REJECTED.");
        }
        
        loan.setStatus(upperStatus);
        return loanRepository.save(loan);
    }

    /**
     * Fulfills "Admin can monitor accounts and approve financial activities"
     */
    public List<LoanApplication> getAllLoanApplications() {
        return loanRepository.findAll();
    }

    // --- Owner Management (CRUD) ---

    public Owner updateOwner(Long id, Owner details) {
        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Owner ID " + id + " not found"));
        owner.setUsername(details.getUsername());
        if(details.getPassword() != null && !details.getPassword().isEmpty()) {
            owner.setPassword(passwordEncoder.encode(details.getPassword()));
        }
        return ownerRepository.save(owner);
    }

    public void deleteOwner(Long id) {
        if (!ownerRepository.existsById(id)) {
            throw new UserNotFoundException("Cannot delete: Owner ID " + id + " not found");
        }
        ownerRepository.deleteById(id);
    }

    public List<Owner> getAllOwners() {
        return ownerRepository.findAll();
    }
}