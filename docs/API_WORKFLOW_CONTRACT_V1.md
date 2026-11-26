# NexusFlow
## API & Workflow JSON Contract — Version 1.0

**Project:** NexusFlow — Visual IoT Telemetry & Rule Engine  
**Organization:** Infotact Solutions  
**Architecture:** MERN Stack + MongoDB Time-Series + RxJS + WebSockets  
**Status:** Proposed Integration Contract  
**Version:** 1.0

---

# 1. Project Objective

NexusFlow is a visual IoT telemetry and rule-engine platform that allows users to create automation workflows without hardcoding device logic.

Users build workflows through a drag-and-drop visual canvas. The backend converts the saved workflow JSON into executable RxJS streams, processes incoming sensor telemetry, evaluates conditions and triggers actions such as alerts.

The system must support:

- High-frequency IoT telemetry ingestion.
- MongoDB Time-Series data storage.
- Visual workflow creation using React Flow.
- Dynamic workflow compilation using Node.js and RxJS.
- Real-time communication using WebSockets.
- Alert generation and monitoring.
- Scalable processing and performance testing.

# 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Visual Workflow Builder | React Flow (`@xyflow/react`) |
| Backend | Node.js + Express.js |
| Stream Processing | RxJS |
| Database | MongoDB 5.0+ Time-Series |
| Real-time Communication | Socket.io |
| API Communication | REST + JSON |
| Charts | Chart.js |
| Development | GitHub, npm, VS Code |

# 3. System Architecture

The expected data flow is:

1. IoT devices or mock hardware generate telemetry.
2. Express ingestion APIs receive telemetry.
3. MongoDB Time-Series stores incoming readings.
4. The workflow engine receives telemetry events.
5. The RxJS compiler executes matching workflows.
6. Conditions and mathematical operations are evaluated.
7. Action nodes generate alerts or trigger configured actions.
8. Socket.io broadcasts relevant updates to connected clients.
9. React displays live telemetry, workflow status and alerts.

# 4. API Standards

**Base URL:** `http://localhost:5000`

**Content-Type:** `application/json`

**General conventions:**

- Use JSON for request and response bodies.
- Use ISO 8601 timestamps in UTC.
- Use meaningful HTTP status codes.
- Validate incoming data before processing.
- Return consistent error responses.
- Keep telemetry ingestion separate from workflow execution.
- Do not expose database credentials in frontend code.

Standard error response:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "INVALID_INPUT",
    "details": "A valid deviceId is required"
  }
}
```

# 5. Telemetry API

These endpoints align with the telemetry routes already implemented on the integration branch.

## 5.1 Health Check

**GET /**

Example response:

```json
{
  "message": "Welcome to NexusFlow API!",
  "status": "Running",
  "database": "Connected"
}
```

## 5.2 Submit Single Telemetry Record

**POST /api/telemetry**

Request:

```json
{
  "deviceId": "turbine-001",
  "sensorType": "Temperature",
  "value": 91.4,
  "unit": "°C",
  "timestamp": "2026-11-26T08:30:00.000Z"
}
```

Expected behavior:

- Validate the telemetry record.
- Convert timestamp to a Date object.
- Store the reading in the MongoDB Time-Series collection.
- Make the accepted event available to the processing pipeline.

## 5.3 Submit Batch Telemetry

**POST /api/telemetry/batch**

Request:

```json
{
  "records": [
    {
      "deviceId": "turbine-001",
      "sensorType": "Temperature",
      "value": 91.4,
      "unit": "°C",
      "timestamp": "2026-11-26T08:30:00.000Z"
    },
    {
      "deviceId": "motor-004",
      "sensorType": "Vibration",
      "value": 6.8,
      "unit": "mm/s",
      "timestamp": "2026-11-26T08:30:01.000Z"
    }
  ]
}
```

Expected behavior:

- Validate every record.
- Insert valid records efficiently.
- Return insertion results and validation errors.
- Support performance testing with larger batches.

Batch-size limits and partial-failure behavior must be finalized during backend implementation.

## 5.4 Retrieve Device Telemetry

**GET /api/telemetry?deviceId=turbine-001&limit=100**

Optional query parameters:

- `deviceId` — required.
- `limit` — optional, default 100, maximum 1000.
- `startTime` — optional.
- `endTime` — optional.

Time-range retrieval:

**GET /api/telemetry?deviceId=turbine-001&startTime=2026-11-26T08:00:00Z&endTime=2026-11-26T09:00:00Z**

# 6. Workflow JSON Contract

The workflow JSON is the central communication format between Bharath's frontend and Jeevith's backend compiler.

All workflow nodes must follow a consistent structure.

## 6.1 Standard Workflow Structure

```json
{
  "version": "1.0",
  "name": "Turbine Overheat Protection",
  "description": "Monitor turbine temperature and trigger alerts",
  "enabled": true,
  "nodes": [],
  "edges": [],
  "metadata": {
    "createdBy": "user",
    "createdAt": "2026-11-26T08:30:00.000Z"
  }
}
```

## 6.2 Supported Node Types

### A. Data Source Node

Purpose: Selects the device and sensor whose telemetry enters the workflow.

Example:

```json
{
  "id": "source-1",
  "type": "sourceNode",
  "position": {
    "x": 100,
    "y": 100
  },
  "data": {
    "label": "Turbine Temperature",
    "deviceId": "turbine-001",
    "sensorType": "Temperature",
    "unit": "°C"
  }
}
```

### B. Condition Node

Purpose: Evaluates incoming telemetry against a configured condition.

Example:

```json
{
  "id": "condition-1",
  "type": "conditionNode",
  "position": {
    "x": 400,
    "y": 100
  },
  "data": {
    "label": "High Temperature",
    "operator": ">",
    "threshold": 80,
    "unit": "°C",
    "severity": "critical",
    "enabled": true
  }
}
```

Supported operators:

- `>`
- `>=`
- `<`
- `<=`
- `==`
- `!=`

Supported severity values:

- `info`
- `warning`
- `critical`

### C. Math Operation Node

Purpose: Performs calculations on incoming telemetry.

Example:

```json
{
  "id": "math-1",
  "type": "mathNode",
  "position": {
    "x": 700,
    "y": 100
  },
  "data": {
    "label": "Temperature Conversion",
    "operation": "multiply",
    "operand": 1.8,
    "enabled": true
  }
}
```

Initial supported operations should include:

- Addition
- Subtraction
- Multiplication
- Division
- Average

The supported operation names and input/output contracts must be agreed upon before compiler implementation.

### D. Action Node

Purpose: Performs an action when the incoming workflow condition is satisfied.

Example:

```json
{
  "id": "action-1",
  "type": "actionNode",
  "position": {
    "x": 1000,
    "y": 100
  },
  "data": {
    "label": "Generate Critical Alert",
    "actionType": "createAlert",
    "severity": "critical",
    "message": "Turbine temperature exceeded safety threshold",
    "enabled": true
  }
}
```

Initial supported action:

- Create alert.

External integrations can be added in a later development phase.

## 6.3 Edge Structure

Edges define the directed data flow between nodes.

Example:

```json
{
  "id": "edge-1",
  "source": "source-1",
  "target": "condition-1"
}
```

Complete example:

```json
{
  "id": "edge-2",
  "source": "condition-1",
  "target": "action-1"
}
```

**Version 1.0 execution rules:**

- A workflow must have at least one data source.
- Nodes must have unique IDs.
- Edges must reference existing nodes.
- Edges define directed processing flow.
- Cycles should be rejected initially.
- Disabled nodes must not execute.
- A condition node should forward matching events along its outgoing path.
- An action node should execute only when it receives an eligible event.
- The compiler must validate the workflow before execution.

The current Bharath frontend uses `ruleNode`. It should be migrated to the standardized node types, or the backend must temporarily support a compatibility mapping from `ruleNode` to `conditionNode`.

# 7. Workflow REST APIs

These endpoints are proposed and are not yet implemented.

## 7.1 Create Workflow

**POST /api/workflows**

Request: Complete Workflow JSON.

Expected behavior:

- Validate workflow structure.
- Validate node types and connections.
- Save workflow configuration in MongoDB.
- Return a unique workflow ID.

## 7.2 List Workflows

**GET /api/workflows**

Returns saved workflows and their basic metadata.

## 7.3 Retrieve Workflow

**GET /api/workflows/:workflowId**

Returns the saved workflow JSON.

## 7.4 Update Workflow

**PUT /api/workflows/:workflowId**

Updates an existing workflow after validation.

## 7.5 Delete Workflow

**DELETE /api/workflows/:workflowId**

Deletes or disables the selected workflow according to the agreed lifecycle policy.

## 7.6 Execute Workflow

**POST /api/workflows/:workflowId/execute**

Expected behavior:

1. Retrieve workflow JSON.
2. Validate its graph.
3. Compile nodes and edges into an RxJS pipeline.
4. Subscribe to the relevant telemetry event stream.
5. Return the execution status.

Example response:

```json
{
  "success": true,
  "workflowId": "wf-001",
  "status": "running",
  "message": "Workflow compiled and started"
}
```

## 7.7 Stop Workflow

**POST /api/workflows/:workflowId/stop**

Expected behavior:

- Stop the active RxJS subscription.
- Release associated resources.
- Update workflow execution status.

# 8. Alert Management APIs

These endpoints are proposed for backend implementation.

## 8.1 Retrieve Alerts

**GET /api/alerts**

Optional filters:

- `severity`
- `status`
- `deviceId`
- `limit`

## 8.2 Retrieve Individual Alert

**GET /api/alerts/:alertId**

## 8.3 Acknowledge Alert

**PATCH /api/alerts/:alertId/acknowledge**

## 8.4 Resolve Alert

**PATCH /api/alerts/:alertId/resolve**

Standard alert structure:

```json
{
  "alertId": "ALT-101",
  "workflowId": "wf-001",
  "deviceId": "turbine-001",
  "sensorType": "Temperature",
  "reading": 91.4,
  "threshold": 80,
  "unit": "°C",
  "severity": "critical",
  "message": "Turbine temperature exceeded critical threshold",
  "status": "active",
  "createdAt": "2026-11-26T08:30:00.000Z"
}
```

Alert status values:

- `active`
- `acknowledged`
- `resolved`

# 9. WebSocket Contract

Socket.io will provide real-time updates between the backend and frontend.

The following event names are proposed.

## Server-to-Client Events

| Event | Purpose |
|---|---|
| `telemetry:update` | Broadcast incoming telemetry |
| `alert:created` | Notify clients about new alerts |
| `alert:updated` | Notify clients about alert status changes |
| `workflow:status` | Report workflow execution status |
| `workflow:error` | Report workflow execution failures |

## Client-to-Server Events

| Event | Purpose |
|---|---|
| `telemetry:subscribe` | Subscribe to telemetry for a device |
| `telemetry:unsubscribe` | Stop receiving selected telemetry |
| `workflow:subscribe` | Subscribe to workflow updates |

Example telemetry event:

```json
{
  "eventId": "evt-001",
  "deviceId": "turbine-001",
  "sensorType": "Temperature",
  "value": 91.4,
  "unit": "°C",
  "timestamp": "2026-11-26T08:30:00.000Z"
}
```

The backend must validate subscription requests and avoid broadcasting unnecessary data to every client.

# 10. MongoDB Time-Series Data Contract

Collection name:

`telemetry`

Time-Series configuration:

- `timeField`: `timestamp`
- `metaField`: `metadata`
- `granularity`: `seconds`

Stored document structure:

```json
{
  "timestamp": "2026-11-26T08:30:00.000Z",
  "metadata": {
    "deviceId": "turbine-001",
    "sensorType": "Temperature",
    "unit": "°C"
  },
  "value": 91.4
}
```

The telemetry storage structure must remain compatible with the existing Rithesh implementation.

Workflow configurations and alerts should use separate collections rather than mixing them into the telemetry collection.

Suggested collections:

- `telemetry`
- `workflows`
- `alerts`

# 11. Frontend Integration Requirements

Bharath's frontend must eventually consume backend data instead of relying only on hardcoded records and simulated readings.

### Dashboard

- Retrieve device information and telemetry.
- Display actual device readings.
- Show live connection status.
- Calculate alert counts from backend data.

### Telemetry Charts

- Retrieve historical telemetry through REST.
- Receive live updates through WebSockets.
- Retain simulation mode for testing.
- Clearly distinguish live and simulated readings.

### Rule Builder

- Export standardized workflow JSON.
- Save and retrieve workflows through REST.
- Validate nodes and edges.
- Display workflow execution status.

### Alerts Console

- Retrieve alerts from backend.
- Support filtering and search.
- Acknowledge and resolve alerts through REST.
- Receive newly generated alerts through WebSockets.

# 12. Backend Integration Requirements

Jeevith's backend implementation should include:

1. Express API route organization.
2. Workflow persistence and retrieval.
3. Workflow JSON validation.
4. Graph validation and compilation.
5. RxJS telemetry processing.
6. Condition and math operations.
7. Action execution.
8. Workflow start/stop lifecycle.
9. Socket.io event broadcasting.
10. Error handling and logging.

The compiler must not treat visual edge connections as decorative. They must determine actual execution flow.

# 13. Performance and Testing Requirements

The project mid-review target includes demonstrating a benchmark of **5,000 telemetry writes per second**.

This is a target to test, not an assumed performance result.

Testing should cover:

- Single-record ingestion.
- Batch ingestion.
- Concurrent telemetry requests.
- MongoDB Time-Series insertion performance.
- Workflow compilation.
- Condition evaluation.
- Alert generation.
- WebSocket delivery.
- Frontend rendering under continuous updates.

Benchmark reports should record:

- Test duration.
- Number of records submitted.
- Successful and failed writes.
- Average throughput.
- Latency measurements.
- CPU and memory usage.
- Database behavior.

# 14. Team Responsibilities

| Team member | Responsibility |
|---|---|
| Jinitha — Team Lead | Architecture, API contract, integration and testing |
| Jeevith — Backend | Express APIs, RxJS compiler, workflow execution and Socket.io |
| Rithesh — Database | MongoDB Time-Series, telemetry persistence and database support |
| Bharath — Frontend | React dashboard, React Flow, charts and alerts interface |

Team members must coordinate against this contract before changing shared API payloads or workflow structures.

# 15. Implementation Priority

### Phase 1 — Foundation

- Finalize API and workflow JSON contract.
- Complete MongoDB telemetry integration.
- Confirm frontend and backend endpoint compatibility.
- Establish shared test payloads.

### Phase 2 — Workflow Management

- Implement workflow save/load APIs.
- Standardize frontend node types.
- Implement workflow validation.
- Agree on node input/output semantics.

### Phase 3 — Stream Compiler

- Compile workflow graph into RxJS streams.
- Connect telemetry ingestion to stream processing.
- Implement condition and math nodes.
- Implement action nodes.

### Phase 4 — Real-Time Integration

- Integrate WebSocket telemetry.
- Generate and persist alerts.
- Connect dashboard and chart components.
- Implement alert acknowledgement and resolution.

### Phase 5 — Testing and Optimization

- Test complete workflows.
- Test multiple devices and sensor types.
- Benchmark telemetry ingestion.
- Validate workflow execution and error handling.
- Demonstrate the 5,000 writes/second target.

# 16. Contract Governance

This document is the proposed Version 1.0 integration baseline.

Any change to the following must be coordinated across the affected team members:

- API endpoint names.
- Telemetry field names.
- Workflow node types.
- Node configuration properties.
- Edge semantics.
- WebSocket event names.
- Database document structures.

Changes should be documented and versioned to avoid frontend/backend incompatibility.

**Important:** Existing telemetry functionality is the implementation baseline. Workflow, alert and WebSocket contracts in this document describe the planned integration and require implementation and testing before they can be considered operational.

---

**End of Document**

**NexusFlow — Visual IoT Telemetry & Rule Engine**  
**Infotact Solutions | API & Workflow JSON Contract | Version 1.0**