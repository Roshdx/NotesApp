# Docker Commands Cheat Sheet for NotesApp

## Quick Start Commands

### 1. Build and Start All Services (Recommended)
```bash
docker-compose up -d --build
```

### 2. Stop All Services
```bash
docker-compose down
```

### 3. View All Logs
```bash
docker-compose logs -f
```

### 4. Restart All Services
```bash
docker-compose restart
```

---

## Docker Compose Commands

### Build All Services
```bash
docker-compose build
```

### Build Specific Service
```bash
docker-compose build frontend
docker-compose build api-gateway
docker-compose build notes-service
```

### Start All Services
```bash
# Start in detached mode
docker-compose up -d

# Start with logs
docker-compose up

# Start with rebuild
docker-compose up -d --build
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Force stop and remove
docker-compose down --remove-orphans
```

### View Service Status
```bash
# List running containers
docker-compose ps

# View all containers (including stopped)
docker ps -a
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f api-gateway
docker-compose logs -f notes-service
docker-compose logs -f userservice
docker-compose logs -f eureka-server
docker-compose logs -f notes-mongo

# Last 100 lines
docker-compose logs --tail=100 frontend
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart frontend
docker-compose restart api-gateway
```

---

## Individual Service Management

### Build Individual Services

#### Frontend
```bash
cd frontend
docker build -t notesapp-frontend:latest .
```

#### Eureka Server
```bash
cd eureka-server
mvn clean package -DskipTests
docker build -t notesapp-eureka-server:latest .
```

#### API Gateway
```bash
cd api-gateway
mvn clean package -DskipTests
docker build -t notesapp-api-gateway:latest .
```

#### User Service
```bash
cd userservice
mvn clean package -DskipTests
docker build -t notesapp-userservice:latest .
```

#### Notes Service
```bash
cd notes-service
mvn clean package -DskipTests
docker build -t notesapp-notes-service:latest .
```

### Run Individual Containers

Create network first:
```bash
docker network create notes-net
```

#### Run MongoDB
```bash
docker run -d \
  --name notes-mongo \
  --network notes-net \
  -p 27017:27017 \
  -v mongo-data:/data/db \
  mongo:6.0
```

#### Run Eureka Server
```bash
docker run -d \
  --name eureka-server \
  --network notes-net \
  -p 8761:8761 \
  notesapp-eureka-server:latest
```

#### Run API Gateway
```bash
docker run -d \
  --name api-gateway \
  --network notes-net \
  -p 8080:8080 \
  -e EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/ \
  notesapp-api-gateway:latest
```

#### Run User Service
```bash
docker run -d \
  --name userservice \
  --network notes-net \
  -p 8081:8081 \
  -e SPRING_DATA_MONGODB_URI=mongodb://notes-mongo:27017/notesdb \
  -e EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/ \
  notesapp-userservice:latest
```

#### Run Notes Service
```bash
docker run -d \
  --name notes-service \
  --network notes-net \
  -p 8082:8082 \
  -e SPRING_DATA_MONGODB_URI=mongodb://notes-mongo:27017/notesdb \
  -e EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://eureka-server:8761/eureka/ \
  notesapp-notes-service:latest
```

#### Run Frontend
```bash
docker run -d \
  --name notes-frontend \
  --network notes-net \
  -p 3000:80 \
  notesapp-frontend:latest
```

---

## Container Management

### Stop Containers
```bash
# Stop all
docker stop $(docker ps -q)

# Stop specific containers
docker stop notes-frontend api-gateway userservice notes-service eureka-server notes-mongo
```

### Remove Containers
```bash
# Remove all stopped containers
docker container prune -f

# Remove specific containers
docker rm -f notes-frontend api-gateway userservice notes-service eureka-server notes-mongo
```

### Remove Images
```bash
# Remove all NotesApp images
docker rmi notesapp-frontend notesapp-api-gateway notesapp-userservice notesapp-notes-service notesapp-eureka-server

# Remove with force
docker rmi -f notesapp-frontend notesapp-api-gateway notesapp-userservice notesapp-notes-service notesapp-eureka-server
```

---

## MongoDB Commands

### Access MongoDB Shell
```bash
# Via Docker exec
docker exec -it notes-mongo mongosh

# Run single command
docker exec notes-mongo mongosh --eval "show dbs"
```

### MongoDB Operations
```bash
# View databases
docker exec notes-mongo mongosh --eval "show dbs"

# View collections
docker exec notes-mongo mongosh notesdb --eval "db.getCollectionNames()"

# View users
docker exec notes-mongo mongosh notesdb --eval "db.users.find().pretty()"

# View notes
docker exec notes-mongo mongosh notesdb --eval "db.notes.find().pretty()"

# Count documents
docker exec notes-mongo mongosh notesdb --eval "db.users.countDocuments(); db.notes.countDocuments()"

# Delete all notes
docker exec notes-mongo mongosh notesdb --eval "db.notes.deleteMany({})"

# Delete all users
docker exec notes-mongo mongosh notesdb --eval "db.users.deleteMany({})"
```

---

## Troubleshooting Commands

### View Container Details
```bash
# Inspect container
docker inspect notes-frontend
docker inspect api-gateway
docker inspect notes-mongo

# View container stats
docker stats

# View container processes
docker top notes-frontend
```

### Network Debugging
```bash
# List networks
docker network ls

# Inspect network
docker network inspect notes-net

# View container IP
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' notes-mongo
```

### Health Checks
```bash
# Check service health
curl http://localhost:3000
curl http://localhost:8761
curl http://localhost:8080/actuator/health
curl http://localhost:8081/api/users/test
curl http://localhost:8082/actuator/health
```

### Volume Management
```bash
# List volumes
docker volume ls

# Inspect mongo volume
docker volume inspect notesapp_mongo-data

# Remove unused volumes
docker volume prune -f

# Backup mongo data
docker run --rm -v notesapp_mongo-data:/data -v $(pwd):/backup busybox tar czf /backup/mongo-backup.tar.gz /data
```

---

## Clean Up Commands

### Remove Everything
```bash
# Stop and remove all containers, networks
docker-compose down --remove-orphans

# Remove all containers
docker container prune -f

# Remove all images
docker image prune -a -f

# Remove all volumes (WARNING: deletes data)
docker volume prune -f

# Remove all unused resources
docker system prune -a -f --volumes
```

### Rebuild from Scratch
```bash
# Stop everything
docker-compose down -v

# Remove images
docker rmi $(docker images 'notesapp-*' -q)

# Rebuild and start
docker-compose up -d --build
```

---

## Useful Aliases (Optional)

Add to your `.bashrc` or `.zshrc`:

```bash
# Docker Compose shortcuts
alias dcu='docker-compose up -d'
alias dcb='docker-compose up -d --build'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'
alias dcr='docker-compose restart'
alias dcp='docker-compose ps'

# Docker shortcuts
alias dps='docker ps'
alias dpsa='docker ps -a'
alias di='docker images'
alias dlogs='docker logs -f'
alias dexec='docker exec -it'

# NotesApp specific
alias notes-logs='docker-compose logs -f frontend'
alias notes-mongo='docker exec -it notes-mongo mongosh'
alias notes-restart='docker-compose restart frontend api-gateway'
```

---

## Port Reference

- **3000**: Frontend (Nginx)
- **5173**: Frontend (Vite dev - not in Docker)
- **8761**: Eureka Server
- **8080**: API Gateway
- **8081**: User Service
- **8082**: Notes Service
- **27017**: MongoDB
