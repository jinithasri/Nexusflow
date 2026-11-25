   import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Network request failed";
    return Promise.reject(new Error(message));
  }
);

export const checkBackendHealth = () => apiClient.get("/");

export const sendTelemetry = ({
  deviceId,
  sensorType,
  value,
  unit,
  timestamp = new Date().toISOString(),
}) =>
  apiClient.post("/api/telemetry", {
    deviceId,
    sensorType,
    value: Number(value),
    unit,
    timestamp,
  });

export const sendTelemetryBatch = (records) =>
  apiClient.post("/api/telemetry/batch", { records });

export const getDeviceTelemetry = (deviceId, limit = 100) =>
  apiClient.get("/api/telemetry", { params: { deviceId, limit } });

export const getTelemetryByTimeRange = (deviceId, startTime, endTime) =>
  apiClient.get("/api/telemetry", { params: { deviceId, startTime, endTime } });

export const saveWorkflow = (workflowPayload) =>
  apiClient.post("/api/workflows", workflowPayload);

export const executeWorkflow = (workflowId) =>
  apiClient.post(`/api/workflows/${workflowId}/execute`);

export default apiClient;