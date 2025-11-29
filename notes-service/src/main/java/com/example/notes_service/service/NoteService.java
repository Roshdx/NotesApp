package com.example.notes_service.service;

import java.time.Instant;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.notes_service.model.Note;
import com.example.notes_service.repository.NoteRepository;

@Service
public class NoteService {

    @Autowired
    private NoteRepository repo;

    public Note create(Note note) {
        Instant now = Instant.now();
        note.setCreatedAt(now);
        note.setUpdatedAt(now);
        return repo.save(note);
    }

    public Page<Note> listByUser(String userId, int page, int size) {
        Pageable p = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));
        return repo.findByUserId(userId, p);
    }

    public Optional<Note> getForUser(String id, String userId) {
        return repo.findById(id).filter(n -> n.getUserId().equals(userId));
    }

    public Optional<Note> update(String id, String userId, Note update) {
        return repo.findById(id).filter(n -> n.getUserId().equals(userId)).map(existing -> {
            existing.setTitle(update.getTitle());
            existing.setContent(update.getContent());
            existing.setTags(update.getTags());
            existing.setPinned(update.isPinned());
            existing.setArchived(update.isArchived());
            existing.setUpdatedAt(Instant.now());
            return repo.save(existing);
        });
    }

    public boolean delete(String id, String userId) {
        return repo.findById(id).filter(n -> n.getUserId().equals(userId)).map(n -> {
            repo.delete(n);
            return true;
        }).orElse(false);
    }
}