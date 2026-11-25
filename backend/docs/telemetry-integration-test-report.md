# MongoDB Telemetry Integration Test Report

Date: 25 November 2026

## Environment
- MongoDB Atlas
- Database: nexusflow
- Collection: telemetry
- Backend API: Node.js and Express

## Tests Performed
- MongoDB connection and Time-Series collection configuration
- Backend health endpoint
- Single telemetry insertion and retrieval
- Batch telemetry insertion and retrieval
- Device-based telemetry retrieval
- Invalid request validation

## Results
All listed integration tests completed successfully.

Telemetry records were successfully stored and retrieved from the MongoDB Time-Series collection.

## Notes
The DNS resolver override is currently required in my local environment because the default Node.js DNS resolver fails the MongoDB Atlas SRV lookup.
