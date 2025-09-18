#!/bin/bash

echo "Waiting for MySQL to be fully ready..."
sleep 10

echo "Running database initialization scripts..."

# Thực thi từng script
mysql -h localhost -u admin -pexample_123 vietsneaker < /scripts/init.sql

echo "Database initialization completed!"
