# Build stage: builds the jar using Maven
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn -DskipTests clean package
# Runtime stage:
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN apk add --no-cache curl
COPY --from=build /build/target/*.jar ./notes-service.jar
EXPOSE 8082
ENTRYPOINT ["java","-jar","/app/notes-service.jar"]