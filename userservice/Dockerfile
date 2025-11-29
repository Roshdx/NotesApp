# userservice/Dockerfile — expects a built jar in target/
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY target/*.jar ./userservice.jar

EXPOSE 8081
ENTRYPOINT ["java","-jar","/app/userservice.jar"]
