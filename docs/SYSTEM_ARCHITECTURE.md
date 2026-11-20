# NEXUSFLOW
## System Architecture & Integration Document

**Project:** Visual IoT Telemetry & Rule Engine  
**Technology:** MERN Stack + RxJS + WebSockets  
**Team:** Four Members  
**Version:** 1.0

---

## 1. Project Overview

NexusFlow is a browser-based, no-code IoT automation platform that allows users to create automated workflows using a visual drag-and-drop interface.

Users can connect different nodes to create automation pipelines.

**Example workflow:**

`Temperature Sensor → Moving Average Filter → Threshold Check → Alert Trigger`

The system receives real-time IoT sensor readings, processes them through configurable workflows, and triggers actions when specified conditions are satisfied.

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Workflow Builder | React Flow (@xyflow/react) |
| Charts | Chart.js |
| API Communication | Axios |
| Backend | Node.js + Express.js |
| Database | MongoDB Time-Series |
| Reactive Engine | RxJS |
| Real-time Communication | Socket.io |
| Version Control | Git + GitHub |

## 3. Team Responsibilities

### Jini — Team Lead & System Architecture
- Design overall system architecture.
- Define communication between modules.
- Coordinate frontend and backend integration.
- Review code and implementation.
- Perform end-to-end testing.
- Manage GitHub workflow and project progress.

### Jeevith — Backend & Rule Engine
- Develop Express REST APIs.
- Implement workflow graph parsing.
- Convert workflow JSON into executable RxJS pipelines.
- Implement rule execution logic.
- Integrate Socket.io for real-time communication.
- Implement alert and webhook triggers.

### Rithesh — Database & Telemetry
- Configure MongoDB Atlas.
- Create MongoDB Time-Series collections.
- Design telemetry data schema.
- Implement sensor data ingestion and storage.
- Optimize database queries.
- Test telemetry write performance.

### Bharath — Frontend & Dashboard
- Develop the React application interface.
- Build the React Flow workflow canvas.
- Create custom nodes:
  - Data Source Node
  - Math Operation Node
  - Filter Node
  - Condition Node
  - Action Trigger Node
- Implement live telemetry charts.
- Integrate frontend with backend APIs and WebSockets.

## 4. System Architecture

### High-level data flow

IoT Sensors → Backend Ingestion API → MongoDB Time-Series

At the same time, incoming telemetry is published to the reactive processing engine.

The workflow engine processes the data according to the user's saved workflow.

Processed results are sent through WebSockets to the dashboard. When a rule condition is satisfied, the system can trigger configured actions such as webhooks or simulated SMS alerts.

### Main architecture components

**A. Frontend**
- Workflow creation and editing.
- Drag-and-drop node connections.
- Workflow JSON serialization.
- Live sensor data visualization.
- Execution status indicators.

**B. Backend**
- REST API endpoints.
- Workflow validation and parsing.
- RxJS pipeline compilation.
- Telemetry processing.
- WebSocket communication.
- Alert execution.

**C. Database**
- Timestamped sensor readings.
- Device identification.
- Telemetry metadata.
- Saved workflow configurations.
- Execution history.

**D. Reactive Engine**
- Sensor data subscriptions.
- Moving average calculations.
- Threshold evaluation.
- Conditional execution.
- Action triggering.

## 5. Proposed API Contracts

These are initial integration contracts for the team to review and agree upon before implementation.

### 5.1 Health Check

`GET /api/health`

Expected response:

```json
{
  "status": "ok",
  "message": "NexusFlow API is running"
}
```

### 5.2 Sensor Data Ingestion

`POST /api/telemetry`

Request:

```json
{
  "deviceId": "turbine-001",
  "sensorType": "temperature",
  "value": 78.5,
  "unit": "celsius",
  "timestamp": "2026-11-20T12:00:00.000Z"
}
```

Expected response:

```json
{
  "success": true,
  "message": "Telemetry received"
}
```

### 5.3 Submit Workflow

`POST /api/workflows`

Request:

```json
{
  "name": "Turbine Temperature Monitor",
  "nodes": [],
  "edges": []
}
```

The actual node and edge structures will be agreed upon between frontend and backend developers.

### 5.4 Retrieve Telemetry

`GET /api/telemetry?deviceId=turbine-001`

Returns sensor readings for the requested device.

### 5.5 Execute Workflow

`POST /api/workflows/:id/execute`

Starts execution of a saved workflow.

### 5.6 Real-time Events

Proposed Socket.io events:

| Event | Purpose |
|---|---|
| `telemetry:update` | Broadcast incoming sensor readings |
| `workflow:status` | Broadcast workflow execution status |
| `alert:triggered` | Notify dashboard of triggered alerts |

## 6. Workflow Execution Logic

The workflow engine should follow these stages:

1. Receive workflow JSON from the frontend.
2. Validate nodes and connections.
3. Identify the starting data source.
4. Build an RxJS pipeline based on connected nodes.
5. Subscribe to incoming telemetry.
6. Execute calculations and conditions.
7. Trigger configured actions.
8. Broadcast execution results to the frontend.

Example:

`Sensor → Moving Average → Threshold (>80) → Webhook`

If the calculated temperature exceeds 80°C, the webhook action should execute.

## 7. GitHub Collaboration Strategy

**Repository:** https://github.com/jinithasri/Nexusflow

Proposed branch structure:

- `main` — stable integrated code.
- `backend` — backend development.
- `database` — database development.
- `frontend` — frontend development.

Guidelines:

1. Do not push unfinished code directly into `main`.
2. Commit changes regularly.
3. Use meaningful commit messages.
4. Create Pull Requests for integration.
5. Test changes before merging.
6. Communicate API or schema changes with the team.

## 8. Development Milestones

| Phase | Deliverable |
|---|---|
| Week 1 | Database setup, ingestion API, frontend canvas |
| Week 2 | Workflow JSON parser and RxJS compiler |
| Mid-review | Demonstrate 5,000 writes/sec as a performance target |
| Week 3 | WebSocket telemetry and live charts |
| Week 4 | Webhook integration and execution feedback |
| Final review | Complete browser-based no-code IoT rule engine |

The 5,000 writes/sec target must be benchmarked under documented test conditions.

## 9. Integration Rules

Before connecting modules, the team must agree on:

- Telemetry JSON structure.
- Workflow node and edge JSON structure.
- REST API request and response formats.
- Socket.io event names and payloads.
- Database collection structure.
- Error handling and validation.

No module should independently change shared interfaces without informing the other members.

## 10. Immediate Action Items

**Jini**
- Review and finalize architecture.
- Coordinate API contracts.
- Maintain integration documentation.

**Jeevith**
- Review backend folder structure.
- Propose API routes and workflow compiler design.
- Coordinate backend requirements.

**Rithesh**
- Configure MongoDB Atlas.
- Propose telemetry schema and Time-Series collection design.
- Share database connection requirements securely.

**Bharath**
- Review frontend structure.
- Plan React Flow canvas and custom node components.
- Share proposed workflow JSON structure.

---

**Document Owner:** Jini — Team Lead  
**Project:** NexusFlow  
**Status:** Initial Architecture Proposal — Pending Team Review
