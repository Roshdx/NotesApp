package com.example.notes_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.notes_service.model.Note;

public interface NoteRepository extends MongoRepository<Note, String> {
    Page<Note> findByUserId(String userId, Pageable pageable);
}
