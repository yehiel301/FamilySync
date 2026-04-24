package com.familysync.api;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PhotoRepository extends MongoRepository<Photo, String> {
    List<Photo> findByFamilyId(String familyId);
}