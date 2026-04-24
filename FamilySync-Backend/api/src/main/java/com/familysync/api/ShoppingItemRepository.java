package com.familysync.api;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository // מסמן שזהו רכיב Repository
public interface ShoppingItemRepository extends MongoRepository<ShoppingItem, String> {

    // Spring Data יבין לבד איך לממש את הפונקציה הזו לפי השם שלה
    List<ShoppingItem> findAllByOrderByOrderAsc();

    // מתודה חדשה לשליפת פריטים לפי משפחה, ממוינים לפי סדר
    List<ShoppingItem> findByFamilyIdOrderByOrderAsc(String familyId);
}