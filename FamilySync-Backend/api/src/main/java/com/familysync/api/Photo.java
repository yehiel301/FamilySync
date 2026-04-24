package com.familysync.api;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document("photos")
public class Photo {
    @Id
    private String id;
    private String familyId;
    private String url;
    private String title;
    private LocalDateTime date;

    public Photo(String familyId, String url, String title) {
        this.familyId = familyId;
        this.url = url;
        this.title = title;
        this.date = LocalDateTime.now();
    }
}