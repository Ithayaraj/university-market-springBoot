package com.spring_boot.uni_market.controller;

import com.spring_boot.uni_market.dto.MessageDTO;
import com.spring_boot.uni_market.service.ChatService;
import com.spring_boot.uni_market.utils.StandardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<StandardResponse> sendMessage(@RequestBody MessageDTO dto) {
        String res = chatService.sendMessage(dto);
        return new ResponseEntity<>(
                new StandardResponse("success", res, null, 201),
                HttpStatus.CREATED);
    }

    @GetMapping("/messages/{conversationId}")
    public ResponseEntity<StandardResponse> getMessages(@PathVariable Long conversationId) {
        List<MessageDTO> messages = chatService.getMessages(conversationId);
        return new ResponseEntity<>(
                new StandardResponse("success", "Messages Retrieved", messages, 200),
                HttpStatus.OK);
    }

    @GetMapping("/conversations/{userId}")
    public ResponseEntity<StandardResponse> getConversations(@PathVariable Long userId) {
        List<com.spring_boot.uni_market.dto.ConversationDTO> conversations = chatService
                .getConversationsForUser(userId);
        return new ResponseEntity<>(
                new StandardResponse("success", "Conversations Retrieved", conversations, 200),
                HttpStatus.OK);
    }
}
