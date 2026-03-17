package com.myfinbank.user_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Specific handler for Banking/Balance errors
    @ExceptionHandler(InsufficientBalanceException.class)
    public ResponseEntity<Map<String, String>> handleBalanceError(InsufficientBalanceException ex) {
        return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED) // 402 status
            .body(Map.of("status", "TRANSACTION_DENIED", "message", ex.getMessage()));
    }

    // 2. Specific handler for Auth/Login errors
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("status", "AUTH_FAILED", "message", ex.getMessage()));
    }

    // 3. General catch-all for anything else (Prevents Ambiguity Error)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleGeneralError(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(Map.of("status", "SYSTEM_ERROR", "message", ex.getMessage()));
    }
}