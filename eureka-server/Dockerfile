# Build stage: builds the jar using Maven
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build
COPY pom.xml .
# copy parent pom / modules if multi-module -- copy entire source for simplicity
COPY src ./src
RUN mvn -DskipTests clean package

# Runtime stage: small jre image
FROM eclipse-temurin:21-jre-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=build /build/target/*.jar ./eureka-server.jar
EXPOSE 8761
ENTRYPOINT ["java","-jar","/app/eureka-server.jar"]
