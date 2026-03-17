package com.myfinbank.owner_service.repository;

import com.myfinbank.owner_service.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    
    // This query fetches the conversation between a specific user and the bank (Admin ID: 999)
    @Query("SELECT m FROM Message m WHERE (m.senderId = :uId AND m.receiverId = 999) " +
           "OR (m.senderId = 999 AND m.receiverId = :uId) ORDER BY m.timestamp ASC")
    List<Message> findChatHistory(@Param("uId") Long uId);
}