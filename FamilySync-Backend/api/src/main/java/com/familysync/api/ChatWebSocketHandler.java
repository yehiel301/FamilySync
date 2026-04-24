package com.familysync.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Component
@ServerEndpoint("/chat/{familyId}")
public class ChatWebSocketHandler {

    private static ChatMessageRepository chatMessageRepository;
    private static final ConcurrentHashMap<String, Session> sessions = new ConcurrentHashMap<>();

    // Configure ObjectMapper to serialize dates as ISO strings
    private static final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    @Autowired
    public void setChatMessageRepository(ChatMessageRepository repo) {
        ChatWebSocketHandler.chatMessageRepository = repo;
    }

    @OnOpen
    public void onOpen(Session session, @PathParam("familyId") String familyId) throws IOException {
        session.getUserProperties().put("familyId", familyId);
        sessions.put(session.getId(), session);

        // Load history and send to the new user
        List<ChatMessage> history = chatMessageRepository.findByFamilyIdOrderByTimestampAsc(familyId);
        for (ChatMessage msg : history) {
            session.getBasicRemote().sendText(objectMapper.writeValueAsString(msg));
        }
        System.out.println("New WebSocket connection for family " + familyId);
    }

    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
        String familyId = (String) session.getUserProperties().get("familyId");
        ChatMessage chatMessage = objectMapper.readValue(message, ChatMessage.class);
        chatMessage.setFamilyId(familyId);
        chatMessage.setTimestamp(LocalDateTime.now());

        // Save to DB
        chatMessageRepository.save(chatMessage);

        // Broadcast to all members of the same family
        for (Session s : sessions.values()) {
            if (s.isOpen() && familyId.equals(s.getUserProperties().get("familyId"))) {
                s.getBasicRemote().sendText(objectMapper.writeValueAsString(chatMessage));
            }
        }
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session.getId());
        System.out.println("WebSocket connection closed: " + session.getId());
    }
}