package com.familysync.api;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByFamilyIdOrderByTimestampAsc(String familyId);
    void deleteByFamilyId(String familyId);
}