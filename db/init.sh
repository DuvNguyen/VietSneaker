#!/bin/bash

echo "Waiting for SQL Server to be fully ready..."
sleep 10

echo "Running database initialization scripts..."

# Thực thi từng script
/opt/mssql-tools/bin/sqlcmd -S clockee-db -U sa -P "$1" -d master -i /scripts/init.sql -C

echo "Database initialization completed!"
