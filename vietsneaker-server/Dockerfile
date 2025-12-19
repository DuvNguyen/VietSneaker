# --- Stage 1: Build (Dùng Maven để đóng gói source code) ---
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copy file config maven trước để tận dụng cache
COPY pom.xml .
# Copy toàn bộ source code vào
COPY src ./src
#Copy ảnh
COPY upload ./upload   

# Build ra file .jar (Bỏ qua test để build nhanh hơn)
RUN mvn clean package -DskipTests

# --- Stage 2: Run (Dùng JRE nhẹ để chạy) ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy file .jar đã build từ Stage 1 sang
# Lưu ý: Lệnh này tự tìm file jar trong target, bất kể tên version là gì
COPY --from=build /app/target/*.jar app.jar

# Tạo user non-root để bảo mật hơn (Best practice)
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Config biến môi trường mặc định (có thể ghi đè từ docker-compose)
# Ép ứng dụng chạy profile PROD
ENV SPRING_PROFILES_ACTIVE=prod

# Expose port 8083 (như trong file config của bạn)
EXPOSE 8083

# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
