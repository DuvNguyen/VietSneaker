IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'clockeedb')
BEGIN
    CREATE DATABASE ClockeeDB;
    PRINT 'Database ClockeeDB created successfully.';
END
ELSE
BEGIN
    PRINT 'Database ClockeeDB already exists.';
END
GO
