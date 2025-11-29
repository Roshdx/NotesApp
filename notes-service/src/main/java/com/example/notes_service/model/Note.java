package com.example.notes_service.model;


import java.time.Instant;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "notes")
public class Note {
    @Id
    private String id;
    private String userId;
    private String title;
    private String content;
    private List<String> tags;
    private boolean pinned;
    private boolean archived;
    private Instant createdAt;
    private Instant updatedAt;
}