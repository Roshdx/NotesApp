package com.example.notes_service.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NoteRequest {
    @NotBlank(message = "title is required")
    private String title;
    private String content;
    private List<String> tags;
    private boolean pinned;
    private boolean archived;
}