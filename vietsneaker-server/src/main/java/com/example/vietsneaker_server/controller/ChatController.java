package com.example.vietsneaker_server.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; // RestController, RequestMapping, PostMapping, RequestBody, GetMapping

import com.example.vietsneaker_server.service.ChatService;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // Body từ FE dạng: { "message": "...." }
    public static class ChatRequest {
        private String message;
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    @PostMapping
    public ResponseEntity<String> chat(@RequestBody ChatRequest req) {
        return ResponseEntity.ok(chatService.processMessage(req.getMessage()));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("ok");
    }
}
