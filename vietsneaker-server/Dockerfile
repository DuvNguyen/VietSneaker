# Require build jar before
FROM amazoncorretto:21.0.4
LABEL maintainer = "trung-kieen"
ENV HOSTNAME=clockee-db

WORKDIR app
COPY  target/clockee-server-*.jar app.jar
COPY  upload upload
EXPOSE 8080:8080
EXPOSE 8081:8081
ENTRYPOINT ["java", "-jar", "app.jar"]
