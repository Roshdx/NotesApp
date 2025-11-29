package com.example.notes_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.notes_service.dto.NoteRequest;
import com.example.notes_service.dto.NoteResponse;
import com.example.notes_service.model.Note;
import com.example.notes_service.service.NoteService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/notes")
@Validated
public class NoteController {

    @Autowired
    private NoteService service;

    private NoteResponse toResponse(Note n) {
        NoteResponse r = new NoteResponse();
        r.setId(n.getId());
        r.setUserId(n.getUserId());
        r.setTitle(n.getTitle());
        r.setContent(n.getContent());
        r.setTags(n.getTags());
        r.setPinned(n.isPinned());
        r.setArchived(n.isArchived());
        r.setCreatedAt(n.getCreatedAt());
        r.setUpdatedAt(n.getUpdatedAt());
        return r;
    }

    @PostMapping
    public ResponseEntity<NoteResponse> create(
            @Valid @RequestBody NoteRequest req,
            @RequestHeader("X-User-Id") String userId
    ) {
        Note note = Note.builder()
                .userId(userId)
                .title(req.getTitle())
                .content(req.getContent())
                .tags(req.getTags())
                .pinned(req.isPinned())
                .archived(req.isArchived())
                .build();

        return ResponseEntity.ok(toResponse(service.create(note)));
    }

    @GetMapping
    public ResponseEntity<Page<NoteResponse>> list(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(service.listByUser(userId, page, size).map(this::toResponse));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteResponse> get(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId
    ) {
        return service.getForUser(id, userId)
                .map(n -> ResponseEntity.ok(toResponse(n)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteResponse> update(
            @PathVariable String id,
            @Valid @RequestBody NoteRequest req,
            @RequestHeader("X-User-Id") String userId
    ) {
        Note update = Note.builder()
                .title(req.getTitle())
                .content(req.getContent())
                .tags(req.getTags())
                .pinned(req.isPinned())
                .archived(req.isArchived())
                .build();

        return service.update(id, userId, update)
                .map(n -> ResponseEntity.ok(toResponse(n)))
                .orElse(ResponseEntity.status(403).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId
    ) {
        boolean ok = service.delete(id, userId);
        return ok ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}