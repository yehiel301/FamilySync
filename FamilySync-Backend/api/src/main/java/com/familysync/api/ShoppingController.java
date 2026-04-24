package com.familysync.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/shopping")
public class ShoppingController {

    private final ShoppingItemRepository shoppingItemRepository;

    @Autowired
    public ShoppingController(ShoppingItemRepository shoppingItemRepository) {
        this.shoppingItemRepository = shoppingItemRepository;
    }

    // Updated to fetch items by familyId
    @GetMapping("/{familyId}")
    public List<ShoppingItem> getShoppingItemsByFamily(@PathVariable String familyId) {
        return shoppingItemRepository.findByFamilyIdOrderByOrderAsc(familyId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ShoppingItem createShoppingItem(@RequestBody ShoppingItem newItem) {
        // The familyId is now expected to be part of the newItem object from the client
        return shoppingItemRepository.save(newItem);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ShoppingItem> toggleShoppingItemCompletion(@PathVariable String id, @RequestBody Map<String, Boolean> updates) {
        Optional<ShoppingItem> existingItemOptional = shoppingItemRepository.findById(id);

        if (existingItemOptional.isPresent()) {
            ShoppingItem existingItem = existingItemOptional.get();

            if (updates.containsKey("completed")) {
                existingItem.setCompleted(updates.get("completed"));
            }

            ShoppingItem savedItem = shoppingItemRepository.save(existingItem);
            return ResponseEntity.ok(savedItem);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteShoppingItem(@PathVariable String id) {
        shoppingItemRepository.deleteById(id);
    }
}