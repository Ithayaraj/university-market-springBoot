package com.spring_boot.uni_market.controller;

import com.spring_boot.uni_market.service.ImageService;
import com.spring_boot.uni_market.utils.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/v1/image")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<StandardResponse> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = imageService.storeFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(fileName)
                .toUriString();

        return new ResponseEntity<>(
                new StandardResponse("success", "File Uploaded", fileDownloadUri, 201),
                HttpStatus.CREATED);
    }
}
