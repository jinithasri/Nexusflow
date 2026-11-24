
# NexusFlow – Database Design

## 1. Overview

This document describes the proposed MongoDB database
design for the NexusFlow Visual IoT Telemetry & Rule Engine.

The database will store timestamped sensor readings
using MongoDB Time-Series collections.

## 2. Database Technology

- Database: MongoDB
- Storage: Time-Series Collection
- Minimum Version: MongoDB 5.0+
- Deployment: MongoDB Atlas (planned)

## 3. Proposed Collections

### 3.1 Devices Collection

Purpose: Store IoT device information.

Proposed fields:

- deviceId: Unique device identifier
- deviceName: Human-readable device name
- deviceType: Type of IoT device
- location: Device location
- status: Device status
- createdAt: Device registration timestamp

### 3.2 Telemetry Collection

Purpose: Store incoming sensor readings.

Collection type: MongoDB Time-Series

Time field: timestamp

Meta field: metadata

Proposed document:

```json
{
  "timestamp": "2026-11-20T12:00:00.000Z",
  "metadata": {
    "deviceId": "turbine-001",
    "sensorType": "temperature",
    "unit": "celsius"
  },
  "value": 78.5
}
```

## 4. Data Flow

1. IoT devices generate sensor readings.
2. Backend ingestion API receives telemetry.
3. Incoming readings are buffered in batches.
4. Telemetry data is stored in MongoDB Time-Series.
5. The reactive engine processes incoming telemetry.
6. Dashboard retrieves and displays sensor information.

## 5. Proposed API Integration

### POST /api/telemetry

Receives incoming sensor readings.

### GET /api/telemetry?deviceId=turbine-001

Retrieves telemetry for a specific device.

## 6. Database Optimization

Planned areas of optimization:

- Efficient time-based queries.
- Device-specific telemetry retrieval.
- Batch insertion.
- Appropriate metadata design.
- Write performance benchmarking.

## 7. Pending Team Decisions

The following items require team discussion:

- Final telemetry schema.
- Device metadata structure.
- Batch ingestion format.
- Time-Series granularity.
- Data retention policy.
- Query and indexing strategy.

## 8. Status

Initial database design proposal.
Pending review and approval by the team.
