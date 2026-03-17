package com.myfinbank.user_service.exception;

// Custom exception for better error clarity
public class InsufficientBalanceException extends RuntimeException {
    public InsufficientBalanceException(String message) {
        super(message);
    }
}