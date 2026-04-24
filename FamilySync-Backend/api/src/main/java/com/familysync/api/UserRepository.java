package com.familysync.api;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    // Spring Data יבין לבד איך לממש את הפונקציה הזו לפי השם שלה
    // היא תחפש משתמש לפי שדה האימייל
    Optional<User> findByEmail(String email);

    // Find one user belonging to a family via the family code
    Optional<User> findFirstByFamilyCode(String familyCode);

    // Find all users belonging to the same family
    List<User> findAllByFamilyId(String familyId);
}