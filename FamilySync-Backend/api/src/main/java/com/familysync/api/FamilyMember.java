package com.familysync.api;

import lombok.Data;
import java.util.UUID;

@Data
public class FamilyMember {
    private String id = UUID.randomUUID().toString(); // מזהה ייחודי לכל בן משפחה (יעזור לנו ב-React)
    private String role; // התפקיד (אבא, אמא, בן, סבתא וכו')
    private String name; // השם של בן המשפחה
}