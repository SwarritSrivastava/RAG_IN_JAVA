package com.swarit.rag;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.SystemPromptTemplate;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
public class RagService {

    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    @Value("classpath:/prompts/rag-prompt.st")
    private Resource ragPromptTemplate;

    public RagService(ChatClient.Builder chatClientBuilder, VectorStore vectorStore) {
        this.chatClient = chatClientBuilder.build();
        this.vectorStore = vectorStore;
    }

    public String retrieveAndGenerate(String message) {
        // 1. Retrieve similar documents
        List<Document> similarDocuments = vectorStore.similaritySearch(SearchRequest.builder().query(message).topK(4).build());
        String information = similarDocuments.stream()
                .map(Document::getText)
                .collect(Collectors.joining("\n"));

        // 2. Augment the prompt
        SystemPromptTemplate systemPromptTemplate = new SystemPromptTemplate(ragPromptTemplate);
        Prompt prompt = new Prompt(List.of(
                systemPromptTemplate.createMessage(Map.of("information", information)),
                new UserMessage(message)));
        
        // 3. Generate the response
        System.out.println("Generated query for the llm");
        return chatClient.prompt(prompt).call().content();
    }

    public void ingestDocument(String filename , String text) {
        System.out.println("Ingesting....");
        List<String> chunks = splitDocument(text, 450);
        for(String chunk : chunks) {
            vectorStore.add(List.of(new Document(chunk , Map.of("source",filename))));
        }
        System.out.println("Ingested");
    }

    public static List<String> splitDocument(String text, int maxTokens) {
        List<String> chunks = new ArrayList<>();
        // Split by sentence endings or new lines using regex
        String[] sentences = text.split("(?<=[.!?])\\s+|\\n+");

        StringBuilder currentChunk = new StringBuilder();
        int currentTokens = 0;

        for (String sentence : sentences) {
            int sentenceTokens = countTokens(sentence);

            if (currentTokens + sentenceTokens > maxTokens) {
                if (currentChunk.length() > 0) {
                    chunks.add(currentChunk.toString().trim());
                    currentChunk = new StringBuilder();
                    currentTokens = 0;
                }

                // If a single sentence exceeds maxTokens, split it by words
                if (sentenceTokens > maxTokens) {
                    String[] words = sentence.split("\\s+");
                    StringBuilder tempChunk = new StringBuilder();
                    int tempTokens = 0;
                    for (String word : words) {
                        if (tempTokens + 1 > maxTokens) {
                            chunks.add(tempChunk.toString().trim());
                            tempChunk = new StringBuilder();
                            tempTokens = 0;
                        }
                        tempChunk.append(word).append(" ");
                        tempTokens++;
                    }
                    if (tempChunk.length() > 0) {
                        chunks.add(tempChunk.toString().trim());
                    }
                    continue;
                }
            }

            currentChunk.append(sentence).append(" ");
            currentTokens += sentenceTokens;
        }

        if (currentChunk.length() > 0) {
            chunks.add(currentChunk.toString().trim());
        }

        return chunks;
    }
    private static int countTokens(String text) {
        return text.split("\\s+").length;
    }
}

