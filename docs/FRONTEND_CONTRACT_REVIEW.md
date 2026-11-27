# NexusFlow – Frontend Review of API & Workflow JSON Contract v1.0

**Reviewer:** Bharath (Frontend — React, React Flow & Dashboard)  
**Target Document:** `docs/API_WORKFLOW_CONTRACT_V1.md`  
**Status:** Review Completed — Ready for Team Alignment

---

## 1. Overall Assessment

The proposed **API & Workflow JSON Contract v1.0** is clear, well-structured, and fully compatible with our `@xyflow/react` (`v13`) and `Chart.js` frontend architecture. No blocking architectural issues were found.

## 2. React Flow Node & Workflow JSON Alignment Points

To migrate smoothly from our current `bharath-frontend` implementation to Contract v1.0 once approved, the following exact mappings are needed:

| Area | Current Frontend (`bharath-frontend`) | Contract v1.0 Specification | Action After Approval |
| :--- | :--- | :--- | :--- |
| **Node Types** | `ruleNode` (+ `PipelineNodes.jsx` prototypes) | `sourceNode`, `conditionNode`, `mathNode`, `actionNode` | Migrate `RuleBuilder.jsx` node registry & presets to all 4 standard node types. |
| **Workflow Envelope** | `{ name, nodes, edges }` | Adds `version: "1.0"`, `description`, `enabled`, `metadata` | Update `workflowPayload` serializer in `RuleBuilder.jsx`. |
| **Condition Node** | Uses `title`, `sensor`, operators `>, >=, <, <=, ==` | Uses `label`, adds `!=` operator; sensor comes from upstream `sourceNode` | Rename `title` → `label`, add `!=` operator, inherit sensor context from `sourceNode`. |
| **Math Node** | Uses `factor` | Uses `operand`, `enabled`; operations: add/subtract/multiply/divide/average | Standardize exact operation enum strings (`add`, `subtract`, `multiply`, `divide`, `average`) with Jeevith. |
| **Action Node** | Prototype uses `alertType: "sms"` | Uses `actionType: "createAlert"`, `severity`, `message`, `enabled` | Align `ActionNode` fields to `createAlert` for Phase 2. |

## 3. REST API & Alert Schema Alignment

- **Telemetry APIs (`services/api.js`):** Already aligned with `GET /`, `POST /api/telemetry`, `POST /api/telemetry/batch`, and `GET /api/telemetry?deviceId=...&limit=...` (plus `startTime`/`endTime`).
- **Workflow & Alert APIs (Phase 2):** Once finalized, `services/api.js` will add:
  - `GET /api/workflows`, `GET/PUT/DELETE /api/workflows/:workflowId`, `POST /api/workflows/:workflowId/stop`
  - `GET /api/alerts`, `PATCH /api/alerts/:alertId/acknowledge`, `PATCH /api/alerts/:alertId/resolve`
- **Alert Payload Fields (`Alerts.jsx`):** Will migrate from local mock fields (`id`, formatted `reading`, `timestamp`) to Contract v1.0 fields (`alertId`, numeric `reading`, numeric `threshold`, `unit`, ISO `createdAt`).

## 4. Minor Clarifications Needed Before Phase 2

1. **Math Operation Enum & Moving Average:** Confirm exact string values (`add`, `subtract`, `multiply`, `divide`, `average`) and whether `average` should include a `windowSize` field (e.g., last 5 readings).
2. **Device List Endpoint:** Confirm whether Dashboard device cards should pull from a future `GET /api/devices` endpoint or derive active devices from `/api/telemetry`.
3. **WebSocket Event Naming:** Confirmed Contract v1.0 uses `alert:created` / `alert:updated` (replacing earlier `alert:triggered`) plus client room subscriptions (`telemetry:subscribe`, `workflow:subscribe`). Frontend will install `socket.io-client` and bind these exact event names in Phase 4.

## 5. Readiness

- Frontend is ready to migrate to Contract v1.0 immediately once Jeevith and Rithesh confirm the final schema.
- `bharath-frontend` PR is ready for review and merge into `main`.