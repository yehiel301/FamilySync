package com.familysync.api;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document("users")
public class User {

    @Id
    private String id;

    private String name;
    private String familyName; // שם המשפחה - הוספנו את השדה החדש

    @Indexed(unique = true)
    private String email;

    private String password;

    private String profileImageUrl;

    private String familyId; // <-- הוספתי את השדה הזה

    private String familyCode; // <-- שדה חדש לקוד המשפחתי

    // --- שינוי כאן: רשימה של אובייקטים מסוג FamilyMember במקום סתם מחרוזות ---
    private List<FamilyMember> familyMembers;
}