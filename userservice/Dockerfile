# Build stage
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn -DskipTests clean package

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=build /build/target/*.jar ./userservice.jar
EXPOSE 8081
ENTRYPOINT ["java","-jar","/app/userservice.jar"]
