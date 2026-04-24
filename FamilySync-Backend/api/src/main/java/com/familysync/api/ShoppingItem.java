package com.familysync.api;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data // Lombok: יוצר אוטומטית Getters, Setters, toString, וכו'.
@Document("shopping-items") // שם ה-collection (הטבלה) ב-MongoDB
public class ShoppingItem {

    @Id // מסמן שזהו המזהה הייחודי
    private String id;

    private String familyId; // <-- נוסף שדה לשיוך למשפחה
    private String text;
    private boolean completed;

    // נוסיף גם שדה לסדר, כדי לשמור על העדיפות
    private int order;
}