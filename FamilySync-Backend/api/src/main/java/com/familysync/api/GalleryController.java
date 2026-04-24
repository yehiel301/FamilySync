package com.familysync.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    private final PhotoRepository photoRepository;
    private final String UPLOAD_DIR = "uploads/";

    @Autowired
    public GalleryController(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    // Endpoint to get all photos for a family
    @GetMapping("/{familyId}")
    public ResponseEntity<List<Photo>> getFamilyPhotos(@PathVariable String familyId) {
        List<Photo> photos = photoRepository.findByFamilyId(familyId);
        return ResponseEntity.ok(photos);
    }

    // Endpoint to upload a new photo
    @PostMapping("/upload")
    public ResponseEntity<?> uploadPhoto(@RequestParam("file") MultipartFile file,
                                         @RequestParam("familyId") String familyId,
                                         @RequestParam("title") String title) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        try {
            // --- File Saving Logic (from FileController) ---
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath);
            String fileUrl = "/uploads/" + uniqueFileName;
            // --- End File Saving Logic ---

            // Create and save the photo metadata to the database
            Photo newPhoto = new Photo(familyId, fileUrl, title);
            Photo savedPhoto = photoRepository.save(newPhoto);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedPhoto);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file: " + e.getMessage());
        }
    }

    // Endpoint to delete a photo
    @DeleteMapping("/{photoId}")
    public ResponseEntity<?> deletePhoto(@PathVariable String photoId) {
        Optional<Photo> photoOptional = photoRepository.findById(photoId);
        if (photoOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Photo photo = photoOptional.get();
        try {
            // Delete the physical file
            Path filePath = Paths.get(UPLOAD_DIR + photo.getUrl().substring("/uploads/".length()));
            Files.deleteIfExists(filePath);

            // Delete the metadata from the database
            photoRepository.deleteById(photoId);

            return ResponseEntity.ok().build();
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete file: " + e.getMessage());
        }
    }
}