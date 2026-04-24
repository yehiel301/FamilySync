package com.familysync.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @DeleteMapping("/{familyId}")
    @Transactional
    public ResponseEntity<Void> deleteChatHistory(@PathVariable String familyId) {
        chatMessageRepository.deleteByFamilyId(familyId);
        // Here you could also notify connected clients via WebSocket that history was cleared
        return ResponseEntity.ok().build();
    }
}