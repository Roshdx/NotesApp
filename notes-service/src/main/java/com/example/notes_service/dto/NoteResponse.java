package com.example.notes_service.dto;

import java.time.Instant;
import java.util.List;

import lombok.Data;

@Data
public class NoteResponse {
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