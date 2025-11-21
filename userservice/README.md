# userservice

Simple Spring Boot User Service (starter project)

## How to run

### Option A — Using Maven installed system-wide
1. Make sure Java 21 is installed and `java --version` reports Java 21.
2. Install Maven and `mvn -v` works.
3. From project root:
   ```
   mvn clean package
   java -jar target/userservice-0.0.1-SNAPSHOT.jar
   ```
   or
   ```
   mvn spring-boot:run
   ```

### Option B — Run from IDE
- Open the project in IntelliJ or VS Code (Java extensions).
- Set Project SDK to Java 21.
- Run `com.notes.userservice.UserserviceApplication` directly.

## Endpoints
- `POST /api/users` - create user
- `GET /api/users` - list users
- `GET /api/users/{id}` - get user
- `PUT /api/users/{id}` - update user
- `DELETE /api/users/{id}` - delete user

H2 console: http://localhost:8080/h2-console (JDBC URL: jdbc:h2:mem:usersdb)
