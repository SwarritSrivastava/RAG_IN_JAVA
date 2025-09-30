package com.swarit.rag;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RagController {

    private final RagService ragService;

    public RagController(RagService ragService) {
        this.ragService = ragService;
    }

    @PostMapping("/ai/rag")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<Map<String,String>> generate(@RequestBody MessageRequest request) {
        String answer = ragService.retrieveAndGenerate(request.message());
        System.out.println("received llm reply");
        Map<String , String> response = Map.of("answer",answer);
        return ResponseEntity.ok(response);
    }

    public static record MessageRequest(String message) {
    }
}