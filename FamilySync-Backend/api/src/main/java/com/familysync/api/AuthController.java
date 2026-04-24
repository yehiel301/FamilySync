package com.familysync.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    @Autowired
    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Helper to generate a random family code
    private String generateFamilyCode() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[6]; // 6 bytes = 8 Base64 characters
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String familyCode = payload.get("familyCode");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User with this email already exists");
        }

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(payload.get("password"));
        newUser.setName(payload.get("name"));
        newUser.setFamilyName(payload.get("familyName"));


        // Scenario 1: User provides a family code to join an existing family
        if (familyCode != null && !familyCode.isEmpty()) {
            Optional<User> existingFamilyUser = userRepository.findFirstByFamilyCode(familyCode);
            if (existingFamilyUser.isPresent()) {
                // Join the existing family
                newUser.setFamilyId(existingFamilyUser.get().getFamilyId());
                newUser.setFamilyCode(familyCode);
            } else {
                // Invalid family code provided
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid family code");
            }
        } else {
            // Scenario 2: User creates a new family
            // Save the user first to generate an ID
            User savedUser = userRepository.save(newUser);
            // Create a new family, using their own ID as the familyId
            savedUser.setFamilyId(savedUser.getId());
            // Generate a new unique family code
            savedUser.setFamilyCode(generateFamilyCode());
            newUser = savedUser;
        }

        // Save the final user object
        User finalUser = userRepository.save(newUser);
        finalUser.setPassword(null); // Don't send password back

        return ResponseEntity.status(HttpStatus.CREATED).body(finalUser);
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        User user = userOptional.get();
        if (!password.equals(user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        // ** FIX: Retroactively add family code to old users on login **
        if (user.getFamilyCode() == null || user.getFamilyCode().isEmpty()) {
            user.setFamilyCode(generateFamilyCode());
            // Also ensure familyId is set, using the old logic
            if (user.getFamilyId() == null) {
                user.setFamilyId(user.getId());
            }
            user = userRepository.save(user); // Save the updated user
        }


        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    // --- API to get all family members ---
    @GetMapping("/family/{familyId}")
    public ResponseEntity<?> getFamilyMembers(@PathVariable String familyId) {
        List<User> familyMembers = userRepository.findAllByFamilyId(familyId);
        // Remove password before sending
        familyMembers.forEach(user -> user.setPassword(null));
        return ResponseEntity.ok(familyMembers);
    }

    // --- API לעדכון משתמש (כולל תמונת פרופיל) ---
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Optional<User> existingUserOptional = userRepository.findById(id);

        if (existingUserOptional.isPresent()) {
            User existingUser = existingUserOptional.get();

            // Check which fields are present in the request and update them
            if (updates.containsKey("name")) {
                existingUser.setName((String) updates.get("name"));
            }
            if (updates.containsKey("profileImageUrl")) {
                existingUser.setProfileImageUrl((String) updates.get("profileImageUrl"));
            }

            User savedUser = userRepository.save(existingUser);
            savedUser.setPassword(null); // Do not return the password
            return ResponseEntity.ok(savedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // --- API למחיקת משתמש ---
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            userRepository.deleteById(id);
            return ResponseEntity.ok().body("User deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}