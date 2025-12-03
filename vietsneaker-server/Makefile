# Author: trung-kieen
############################################
# Require maven to perform any action here #
############################################


# Run dev profile use mssql port 1433
run:
	mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev,redis"
# For Unix
build:
	mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod,redis"

# For window when apply production profile will be tricky
# Apply port 1434 for mssql (docker container) to avoid port conflict in target machine in production level
# Do not use mvn spring-boot:run without any specify prod profile. It will not work!
build-window:
	mvn package -D maven.test.skip=true
	java -jar .\target\vietsneaker-server-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod



local:
	mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local,redis"

# Require docker service to perform intergration test
test:
	mvn test
