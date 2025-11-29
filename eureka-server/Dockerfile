# eureka-server/Dockerfile — expects a built jar in target/
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# copy any jar produced by Maven into the container with a fixed name
COPY target/*.jar ./eureka-server.jar

EXPOSE 8761
ENTRYPOINT ["java","-jar","/app/eureka-server.jar"]
