#!/bin/bash
mvn clean package

docker build -t clockee-server:latest . && docker run --network clockee_clockee-network -p 8080:8080 -e DBMS_HOST=clockee-db clockee-server
