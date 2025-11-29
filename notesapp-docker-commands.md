# Docker Commands Cheat Sheet for NotesApp

## 1. Build All Services Using Docker Compose
```
docker compose build
```

## 2. Build and Run All Services
```
docker compose up --build
```

## 3. Run All Services (Already Built)
```
docker compose up
```

## 4. Shutdown All Containers
```
docker compose down
```

## 5. Build Individual Service (from project root)
### Eureka Server
```
cd eureka-server
mvn -DskipTests clean package
docker build -t notesapp-eureka-server:latest .
```

### API Gateway
```
cd api-gateway
mvn -DskipTests clean package
docker build -t notesapp-api-gateway:latest .
```

### User Service
```
cd userservice
mvn -DskipTests clean package
docker build -t notesapp-userservice:latest .
```

## 6. Run Individual Containers
### Run Eureka
```
docker run -d --name eureka-server -p 8761:8761 notesapp-eureka-server:latest
```

### Run API Gateway (same network as Eureka)
```
docker run -d --name api-gateway --network notes-net -p 8080:8080 notesapp-api-gateway:latest
```

### Run User Service
```
docker run -d --name userservice --network notes-net -p 8081:8081 notesapp-userservice:latest
```

## 7. Remove Containers
```
docker rm -f eureka-server api-gateway userservice
```

## 8. Remove All NotesApp Images
```
docker rmi notesapp-eureka-server notesapp-api-gateway notesapp-userservice
```

## 9. Check Logs
```
docker logs -f eureka-server
docker logs -f api-gateway
docker logs -f userservice
```

## 10. Prune Unused Resources
```
docker system prune -f
docker volume prune -f
```
