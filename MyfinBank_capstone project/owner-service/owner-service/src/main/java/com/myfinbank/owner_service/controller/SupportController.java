package com.myfinbank.owner_service.controller;

import com.myfinbank.owner_service.entity.Message;
import com.myfinbank.owner_service.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner/support") // This ensures no conflict with /api/owner
@CrossOrigin(origins = "http://localhost:3000")
public class SupportController {

    @Autowired
    private MessageRepository messageRepository;

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<Message>> getChatHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(messageRepository.findChatHistory(userId));
    }

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        return ResponseEntity.ok(messageRepository.save(message));
    }
}