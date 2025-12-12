# ----------- BUILD STAGE -----------
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn -B -DskipTests clean package

# ----------- RUNTIME STAGE -----------
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy JAR
COPY --from=builder /app/target/*.jar app.jar

# Copy keystore
COPY src/main/resources/keystore ./keystore

# Port HTTPS của bạn
EXPOSE 8083

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
