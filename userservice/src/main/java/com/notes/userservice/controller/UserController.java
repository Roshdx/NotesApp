package com.notes.userservice.controller;

import com.notes.userservice.model.User;
import com.notes.userservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    // ----- Test Endpoints -----

    @GetMapping("/test")
    public ResponseEntity<String> testConnection() {
        return ResponseEntity.ok("User Service is running ✓");
    }

    @GetMapping("/test-db")
    public ResponseEntity<String> testDBConnection() {
        try {
            long count = service.getAll().size();
            return ResponseEntity.ok("MongoDB connection OK ✓ | Users count: " + count);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("MongoDB connection FAILED ✗ | Error: " + e.getMessage());
        }
    }

    // ----- CRUD Endpoints -----

    @PostMapping
    public User create(@RequestBody User user) {
        return service.create(user);
    }

    @GetMapping
    public List<User> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public User get(@PathVariable String id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable String id, @RequestBody User user) {
        return service.update(id, user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
