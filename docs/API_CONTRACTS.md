
# NexusFlow – API Contracts

**Version:** 1.0 (Draft)  
**Status:** Pending Team Review

## 1. Telemetry Ingestion API

This API allows IoT devices and simulated sensors to send
sensor readings to the NexusFlow backend.

### Endpoint

- Method: POST
- URL: `/api/telemetry`
- Content-Type: `application/json`

### Request Body

```json
{
  "deviceId": "turbine-001",
  "sensorType": "temperature",
  "value": 85,
  "unit": "celsius",
  "timestamp": "2026-11-20T12:00:00.000Z"
}
```

### Field Descriptions

| Field | Type | Description |
|---|---|---|
| deviceId | String | Unique sensor device ID |
| sensorType | String | Type of sensor |
| value | Number | Sensor reading |
| unit | String | Measurement unit |
| timestamp | ISO 8601 String | Reading timestamp |

### Successful Response

HTTP Status: `201 Created`

```json
{
  "success": true,
  "message": "Telemetry received successfully",
  "data": {
    "deviceId": "turbine-001",
    "sensorType": "temperature",
    "value": 85
  }
}
```

### Validation Rules

1. deviceId must not be empty.
2. sensorType must not be empty.
3. value must be a valid number.
4. unit must not be empty.
5. timestamp must be a valid ISO 8601 date.

### Error Response

```json
{
  "success": false,
  "message": "Invalid telemetry data"
}
```

**Responsible Members:** Jeevith (Backend) and Rithesh (Database & Telemetry).

**Status:** Proposed – Pending Team Approval.


## 2. Workflow Graph JSON Contract

The frontend uses React Flow to create visual IoT workflows.

The workflow is serialized into JSON and sent to the Node.js backend for validation and compilation into RxJS streams.

### Example Workflow

Turbine Sensor → Moving Average Filter → SMS Alert

### Workflow Structure

```json
{
  "workflowId": "workflow-001",
  "name": "Turbine Temperature Monitor",
  "nodes": [
    {
      "id": "sensor-1",
      "type": "dataSource",
      "position": {
        "x": 100,
        "y": 100
      },
      "data": {
        "label": "Turbine Sensor",
        "deviceId": "turbine-001",
        "sensorType": "temperature"
      }
    },
    {
      "id": "filter-1",
      "type": "movingAverage",
      "position": {
        "x": 400,
        "y": 100
      },
      "data": {
        "label": "Moving Average Filter",
        "windowSize": 5
      }
    },
    {
      "id": "alert-1",
      "type": "smsAlert",
      "position": {
        "x": 700,
        "y": 100
      },
      "data": {
        "label": "SMS Alert",
        "message": "High turbine temperature detected"
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "sensor-1",
      "target": "filter-1"
    },
    {
      "id": "edge-2",
      "source": "filter-1",
      "target": "alert-1"
    }
  ]
}
```

### Node Types

| Node Type | Purpose |
|---|---|
| dataSource | Receives sensor telemetry |
| movingAverage | Calculates moving average |
| mathOperation | Performs mathematical calculations |
| condition | Evaluates logical conditions |
| smsAlert | Triggers an SMS alert |

### Edge Structure

Each edge defines a connection between two nodes.

- source: ID of the starting node.
- target: ID of the destination node.

### Validation Requirements

1. Every node must have a unique ID.
2. Every edge must reference existing nodes.
3. Node types must be supported by the backend.
4. Node configuration must contain valid values.
5. Invalid or cyclic workflows must be rejected unless explicitly supported.
6. The workflow must have a valid execution path.

**Status:** Proposed – Pending Frontend and Backend Team Review.


## 3. Workflow Execution & Real-Time Events

This contract defines how the backend reports workflow execution results to the React frontend.

### 3.1 Execute Workflow API

**Endpoint:** `POST /api/workflows/:workflowId/execute`

**Purpose:** Starts execution of a validated workflow.

Successful response:

```json
{
  "success": true,
  "workflowId": "workflow-001",
  "status": "running",
  "message": "Workflow execution started"
}
```

### 3.2 Socket.io Events

The backend uses Socket.io to communicate real-time execution updates to the frontend.

| Event | Direction | Purpose |
|---|---|---|
| telemetry:update | Backend → Frontend | Send live sensor readings |
| workflow:status | Backend → Frontend | Report workflow execution status |
| node:executed | Backend → Frontend | Identify the node that executed |
| alert:triggered | Backend → Frontend | Notify the frontend of an alert |
| workflow:error | Backend → Frontend | Report execution errors |

### 3.3 Node Execution Event

Event: `node:executed`

Example payload:

```json
{
  "workflowId": "workflow-001",
  "nodeId": "filter-1",
  "status": "success",
  "timestamp": "2026-11-20T12:00:00.000Z"
}
```

### 3.4 Alert Event

Event: `alert:triggered`

Example payload:

```json
{
  "workflowId": "workflow-001",
  "nodeId": "alert-1",
  "alertType": "sms",
  "message": "High turbine temperature detected",
  "status": "triggered",
  "timestamp": "2026-11-20T12:00:00.000Z"
}
```

### 3.5 Workflow Error Event

Event: `workflow:error`

Example payload:

```json
{
  "workflowId": "workflow-001",
  "nodeId": "filter-1",
  "error": "Invalid node configuration",
  "timestamp": "2026-11-20T12:00:00.000Z"
}
```

### 3.6 Execution Status Values

| Status | Meaning |
|---|---|
| pending | Workflow has not started |
| running | Workflow is executing |
| success | Execution completed successfully |
| failed | Execution encountered an error |

**Responsible Members:** Jeevith (Backend) and Bharath (Frontend).

**Status:** Proposed – Pending Team Review.
