# NotesApp

A full-stack microservices-based note-taking application with a modern React frontend and Spring Boot backend. This project demonstrates a distributed architecture using service discovery, API gateway, authentication, and containerized deployment.

## Overview

NotesApp is a scalable note management system that allows users to register, login, and manage their personal notes. The application is built using a microservices architecture with a React frontend, independent backend services, and MongoDB for data persistence.

## Features

### Frontend (React)
- ✅ **User Authentication** - Login and registration system
- ✅ **Notes Management** - Create, read, update, and delete notes
- ✅ **Pin Notes** - Pin important notes to the top
- ✅ **Search** - Filter notes by title or content
- ✅ **Tags** - Organize notes with tags
- ✅ **Modern UI** - Clean design with Heming variable monotype font
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Real-time Updates** - All changes persist immediately
- ✅ **Delete from Sidebar** - Quick delete buttons on each note

### Backend Services
- ✅ **Service Discovery** - Netflix Eureka for automatic service registration
- ✅ **API Gateway** - Centralized routing with Spring Cloud Gateway
- ✅ **User Management** - Complete user CRUD operations
- ✅ **Notes Service** - Secure notes management with user isolation
- ✅ **MongoDB** - NoSQL database for flexible data storage

## Architecture

The application consists of the following components:

### Frontend
- **frontend** (Port 3000): React SPA with Vite, authentication, and notes UI

### Backend Services
- **Eureka Server** (Port 8761): Service discovery and registry
- **API Gateway** (Port 8080): Entry point for all API requests
- **User Service** (Port 8081): User account management
- **Notes Service** (Port 8082): Note creation, storage, and retrieval with user isolation
- **MongoDB** (Port 27017): NoSQL database for users and notes

## Technology Stack

### Frontend
- **React** 19.2.0 with Hooks
- **Vite** 7.2.4 (build tool)
- **Heming Font** (variable monotype)
- **Nginx** (production deployment)
- **Custom CSS** with modern design system

### Backend
- **Framework**: Spring Boot 3.x (3.3.5 and 3.2.0)
- **Language**: Java 17/21
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway (reactive)
- **Database**: MongoDB 6.0
- **Security**: Custom header-based authentication (X-User-Id)
- **Containerization**: Docker & Docker Compose
- **Build Tool**: Maven

## Getting Started

### Prerequisites

- **Java** 17 or higher
- **Maven** 3.6+
- **Node.js** 20+
- **Docker** and **Docker Compose**

### Quick Start (Docker - Recommended)

1. **Build backend services:**
```bash
mvn clean package -f eureka-server/pom.xml
mvn clean package -f api-gateway/pom.xml
mvn clean package -f userservice/pom.xml
mvn clean package -f notes-service/pom.xml
```

2. **Start all services:**
```bash
docker-compose up -d --build
```

3. **Access the application:**
- **Frontend**: http://localhost:3000
- **Eureka Dashboard**: http://localhost:8761
- **API Gateway**: http://localhost:8080
- **MongoDB**: localhost:27017 (via MongoDB Compass)

### Running Locally (Development)

#### Backend Services

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

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at http://localhost:5173

## API Endpoints

### User Service (via Gateway)

Base URL: `http://localhost:8080/userservice/api/users`

- `POST /` - Create new user
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
  ```
- `GET /` - Get all users
- `GET /{id}` - Get user by ID
- `PUT /{id}` - Update user
- `DELETE /{id}` - Delete user
- `GET /test` - Health check
- `GET /test-db` - Database connection test

### Notes Service (via Gateway)

Base URL: `http://localhost:8080/notes-service/api/notes`

**Authentication**: All requests require `X-User-Id` header

- `POST /` - Create new note
  ```json
  {
    "title": "My Note",
    "content": "Note content here",
    "tags": ["important"],
    "pinned": false,
    "archived": false
  }
  ```
- `GET /?page=0&size=100` - Get all notes (paginated)
- `GET /{id}` - Get note by ID
- `PUT /{id}` - Update note
- `DELETE /{id}` - Delete note

## Service Ports

- **3000**: Frontend (Nginx in production)
- **5173**: Frontend (Vite dev server)
- **8761**: Eureka Server
- **8080**: API Gateway
- **8081**: User Service
- **8082**: Notes Service
- **27017**: MongoDB

## Project Structure

```
NotesApp/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # Login, Register components
│   │   ├── services/       # API service layer
│   │   ├── App.jsx         # Main app component
│   │   └── App.css         # Styles
│   ├── Dockerfile          # Multi-stage build
│   ├── nginx.conf          # Nginx configuration
│   └── package.json
├── eureka-server/          # Service discovery server
├── api-gateway/            # API gateway service
├── userservice/            # User management service
├── notes-service/          # Notes management service
├── docker-compose.yml      # Docker orchestration
├── CLAUDE.md              # Development guide
└── README.md
```

## User Workflow

### First-Time User
1. Visit http://localhost:3000
2. Click **"Create one"** to register
3. Fill in first name, last name, and email
4. Click **"Create Account"**
5. Automatically logged in and ready to create notes

### Returning User
1. Visit http://localhost:3000
2. Enter your email address
3. Click **"Sign In"**
4. Access your notes

### Managing Notes
1. **Create** - Click the "+" button in sidebar
2. **Edit** - Click any note to select and edit
3. **Pin** - Click pin icon to keep important notes at top
4. **Delete** - Click trash icon in sidebar or editor
5. **Search** - Type in search box to filter notes
6. **Logout** - Click logout button to sign out

## MongoDB Access

### Via MongoDB Compass
```
Connection String: mongodb://localhost:27017
Database: notesdb
Collections: users, notes
```

### Via Docker Exec
```bash
docker exec -it notes-mongo mongosh

use notesdb
db.users.find()
db.notes.find()
```

## Docker Commands

```bash
# Start all services
docker-compose up -d

# Start with rebuild
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart specific service
docker-compose restart frontend

# View running containers
docker ps
```

## Environment Variables

### Frontend
- `VITE_API_BASE_URL` - Backend API Gateway URL (default: http://localhost:8080)

### Backend Services
- Configured via `application.properties` in each service
- MongoDB URI, Eureka URL, service ports

## Development Guide

See [CLAUDE.md](./CLAUDE.md) for detailed development instructions including:
- Architecture details
- Service communication patterns
- Building and running services
- Testing procedures
- Configuration details

See [frontend/README.md](./frontend/README.md) for frontend-specific documentation.

## Troubleshooting

### Frontend can't connect to backend
- Verify API Gateway is running: `docker ps | grep api-gateway`
- Check backend services are registered: http://localhost:8761

### MongoDB connection issues
- Ensure MongoDB container is running: `docker ps | grep mongo`
- Check port 27017 is not blocked
- Verify no other MongoDB instance is running locally

### Notes not loading
- Check `X-User-Id` header is being sent
- Verify user exists in database
- Check notes-service logs: `docker logs notes-service`

### Build failures
- Clean Maven cache: `mvn clean install -U`
- Rebuild Docker images: `docker-compose build --no-cache`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes.

## Author

Built with Spring Boot, React, and Docker.
