# api-gateway/Dockerfile — expects a built jar in target/
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY target/*.jar ./api-gateway.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/api-gateway.jar"]
