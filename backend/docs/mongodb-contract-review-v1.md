# MongoDB Contract Review — API & Workflow JSON Contract v1.0

Reviewer: Rithesh — Database
Date: 26 November 2026
Source: docs/API_WORKFLOW_CONTRACT_V1.md

## 1. Telemetry Schema Review

The proposed telemetry schema is compatible with the existing MongoDB
Time-Series implementation.

Confirmed fields:
- timestamp: BSON Date
- metadata.deviceId: device identifier
- metadata.sensorType: sensor type
- metadata.unit: measurement unit
- value: numeric sensor reading

Time-Series configuration:
- Collection: telemetry
- timeField: timestamp
- metaField: metadata
- granularity: seconds

The existing implementation also configures bucketMaxSpanSeconds
to 3600. This is an additional collection configuration and does
not conflict with the contract.

## 2. Workflow Collection

The contract proposes a separate workflows collection.

Database suggestions for team discussion:
- Store the standardized workflow JSON as the workflow configuration.
- Keep workflow identity and timestamps available for retrieval and updates.
- Consider preserving workflow versions to support safe updates and recovery.
- Validate node and edge references before saving.

These are recommendations for implementation discussion, not changes
to the agreed workflow JSON contract.

## 3. Alerts Collection

The contract proposes a separate alerts collection.

The proposed alert fields include:
- alertId
- workflowId
- deviceId
- sensorType
- reading
- threshold
- unit
- severity
- message
- status
- createdAt

Database suggestions for team discussion:
- Ensure alert identifiers are unique.
- Consider indexes for status, severity, deviceId and createdAt
  to support filtering and recent-alert queries.
- Consider storing acknowledgedAt and resolvedAt timestamps
  when the corresponding alert actions are implemented.

## 4. Findings

- No blocking mismatch was identified in the telemetry schema.
- The existing telemetry collection should remain unchanged.
- Workflow configurations and alerts should be stored separately
  from telemetry records.
- Workflow and alert persistence are future integration tasks.
- Indexes and lifecycle fields should be finalized with the backend
  and team lead before implementation.

## 5. Recommendation

Proceed with the existing telemetry schema as the database baseline.

Before implementing workflow and alert persistence, coordinate
the document structure, versioning approach, indexes and lifecycle
fields with the team.

No API or workflow JSON structure changes are proposed in this review.
