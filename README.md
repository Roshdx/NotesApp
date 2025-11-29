# NotesApp

A microservices-based note-taking application built with Spring Boot and Spring Cloud. This project demonstrates a distributed architecture using service discovery, API gateway, and containerized deployment.

## Overview

NotesApp is a scalable note management system that allows users to create, read, update, and delete notes. The application is built using a microservices architecture pattern with independent services that communicate through a centralized API gateway and service registry.

## Architecture

The application consists of the following microservices:

- **Eureka Server**: Service discovery and registry for all microservices
- **API Gateway**: Entry point for all client requests, routes to appropriate services
- **User Service**: Manages user accounts and authentication
- **Notes Service**: Handles note creation, storage, and retrieval with OAuth2 security

All services use MongoDB for data persistence and are fully containerized with Docker.

## Technology Stack

- **Framework**: Spring Boot 3.x
- **Language**: Java 17/21
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway
- **Database**: MongoDB
- **Security**: Spring Security with OAuth2
- **Containerization**: Docker & Docker Compose
- **Build Tool**: Maven

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- Docker and Docker Compose

### Running with Docker

1. Build all services:
```bash
mvn clean package -f eureka-server/pom.xml
mvn clean package -f api-gateway/pom.xml
mvn clean package -f userservice/pom.xml
mvn clean package -f notes-service/pom.xml
```

2. Start all services:
```bash
docker-compose up -d
```

3. Access the application:
- Eureka Dashboard: http://localhost:8761
- API Gateway: http://localhost:8080
- User Service (via gateway): http://localhost:8080/userservice/api/users/test
- Notes Service (via gateway): http://localhost:8080/notes-service/api/notes

### Running Locally

Start services in this order:

```bash
# 1. Start MongoDB on port 27017

# 2. Start Eureka Server
cd eureka-server && mvn spring-boot:run

# 3. Start microservices
cd userservice && mvn spring-boot:run
cd notes-service && mvn spring-boot:run

# 4. Start API Gateway
cd api-gateway && mvn spring-boot:run
```

## API Endpoints

### User Service
- `GET /api/users/test` - Test endpoint
- `GET /api/users/test-db` - Test database connection
- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Notes Service
- Check the notes-service controller for available endpoints

## Service Ports

- 8761: Eureka Server
- 8080: API Gateway
- 8081: User Service
- 8082: Notes Service
- 27017: MongoDB

## Project Structure

```
NotesApp/
├── eureka-server/       # Service discovery server
├── api-gateway/         # API gateway service
├── userservice/         # User management service
├── notes-service/       # Notes management service
├── docker-compose.yml   # Docker orchestration
└── README.md
```