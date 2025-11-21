package com.notes.userservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Document(collection = "users")
@Data
public class User {
    @Id
    private String id;

    private String firstName;
    private String lastName;

    @Email
    private String email;
}

