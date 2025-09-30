package com.swarit.rag;

import java.io.IOException;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/documents")
public class DocumentController {
    @Autowired
    private RagService service;

    private static final long MAX_SIZE = 5 * 1024 * 1024;

    @PostMapping("/upload")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<String> uploadDocument(@RequestParam("file") MultipartFile file) {
            try {
                if(!file.getOriginalFilename().endsWith(".pdf")) {
                    return ResponseEntity.badRequest().body("Send pdf file only");
                }
                if(file.getSize() > MAX_SIZE) {
                    return ResponseEntity.badRequest().body("File Size must be smaller than 5MB");
                }
    
                String text;
                try (PDDocument document = Loader.loadPDF(new RandomAccessReadBuffer(file.getInputStream()))){
                        PDFTextStripper stripper = new PDFTextStripper();
                        text = stripper.getText(document);
                } 
                
                if(text.isBlank()) {
                    return ResponseEntity.badRequest().body("Empty File!");
                }
                service.ingestDocument(file.getOriginalFilename(), text);
                return ResponseEntity.ok("Document uploaded and indexed");
            } 
            catch (IOException e) {
                return ResponseEntity.internalServerError().body("ATMKBFJG" + e.getMessage());
            }
    }
    

}
