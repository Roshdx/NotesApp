# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a microservices-based Notes application built with Spring Boot and Spring Cloud. The system consists of multiple services orchestrated through service discovery and an API gateway.

## Architecture

### Microservices Structure

The application follows a microservices pattern with the following components:

1. **eureka-server** (Port 8761): Netflix Eureka service registry - all microservices register here for discovery
2. **api-gateway** (Port 8080): Spring Cloud Gateway - reactive gateway that routes requests to microservices using service discovery
3. **userservice** (Port 8081): User management service with MongoDB persistence
4. **notes-service** (Port 8082): Notes management service with MongoDB persistence and OAuth2 resource server security

### Service Communication

- All services register with Eureka Server for service discovery
- API Gateway uses Eureka to dynamically discover and route to microservices
- Services communicate via service names (e.g., `http://userservice/...`) resolved through Eureka
- Gateway enables automatic routing: `http://localhost:8080/userservice/*` routes to userservice instances

### Technology Stack

- **Spring Boot**: 3.3.5 (eureka, api-gateway, userservice) and 3.2.0 (notes-service)
- **Java**: 21 (most services) and 17 (notes-service)
- **Spring Cloud**: 2023.0.6
- **Database**: MongoDB (shared database `notesdb`)
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway (reactive)
- **Security**: notes-service uses Spring Security with OAuth2 resource server

### Docker Deployment

All services are containerized and orchestrated via docker-compose:

- Services use Docker service names for inter-service communication (e.g., `mongo:27017`, `eureka-server:8761`)
- MongoDB data persists in a named volume `mongo-data`
- All services are on the `notes-net` bridge network
- Services have `restart: on-failure` policy

## Common Commands

### Building Services

Each microservice uses Maven for builds. Build all services before running Docker:

```bash
# Build individual service
cd userservice
mvn clean package

cd api-gateway
mvn clean package

cd eureka-server
mvn clean package

cd notes-service
mvn clean package
```

### Running with Docker

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d userservice

# View logs
docker-compose logs -f userservice

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### Running Locally (without Docker)

Start services in this order for proper dependency resolution:

```bash
# 1. Start MongoDB locally on port 27017

# 2. Start Eureka Server
cd eureka-server
mvn spring-boot:run

# 3. Start microservices (after Eureka is up)
cd userservice
mvn spring-boot:run

cd notes-service
mvn spring-boot:run

# 4. Start API Gateway (after services register)
cd api-gateway
mvn spring-boot:run
```

Note: When running locally, notes-service uses `localhost` URLs in application.properties. For Docker deployment, services use container service names.

### Testing

```bash
# Run tests for a service
cd userservice
mvn test

# Run single test class
mvn test -Dtest=UserServiceTest

# Run single test method
mvn test -Dtest=UserServiceTest#testCreateUser
```

## Important Configuration Details

### Port Assignments

- 8761: Eureka Server
- 8080: API Gateway
- 8081: userservice
- 8082: notes-service
- 27017: MongoDB

### Service Registration

All microservices (except Eureka) have:
- `eureka.client.register-with-eureka=true`
- `eureka.client.fetch-registry=true`

Eureka Server itself has these set to `false` (standalone mode).

### MongoDB Connection

- **Docker**: Services connect to `mongodb://mongo:27017/notesdb`
- **Local**: notes-service connects to `mongodb://localhost:27017/notesdb`
- Database name: `notesdb`

### Package Structure

Each service follows standard Spring Boot layering:
- `controller/`: REST endpoints
- `service/`: Business logic
- `repository/`: Data access (Spring Data MongoDB)
- `model/`: Domain entities

### Service-Specific Notes

**notes-service**:
- Uses OAuth2 Resource Server configuration
- Has Spring Security dependencies
- Uses Java 17 (different from other services)
- Spring Boot 3.2.0 (older than other services)

**api-gateway**:
- Spring Cloud Gateway (reactive stack)
- Discovery locator enabled for automatic route creation
- Lower-case service IDs enabled

**userservice**:
- Uses Lombok for boilerplate reduction
- Has validation dependencies
- Spring Boot DevTools for development

## Development Workflow

1. **Adding New Features**: Follow the existing layered architecture (Controller → Service → Repository)
2. **Service Discovery**: New services must include `spring-cloud-starter-netflix-eureka-client` and register with Eureka
3. **Docker Integration**: Add Dockerfile similar to existing services and update docker-compose.yml
4. **Database**: All services currently share the same MongoDB instance and database

## Accessing Services

- Eureka Dashboard: http://localhost:8761
- API Gateway: http://localhost:8080
- Direct service access (development): http://localhost:8081, http://localhost:8082
- Production routing: All requests through gateway at http://localhost:8080/{service-name}/*
