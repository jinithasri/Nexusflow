import React from "react";
import { Handle, Position } from "@xyflow/react";

const cardBase = {
  width: 225,
  padding: 14,
  background: "#ffffff",
  borderRadius: 12,
  boxShadow: "0 4px 14px rgba(15, 23, 42, 0.08)",
  fontFamily: '"Segoe UI", Arial, sans-serif',
};

const tagStyle = (bg, color) => ({
  display: "inline-block",
  fontSize: 10,
  fontWeight: 700,
  padding: "3px 8px",
  borderRadius: 999,
  background: bg,
  color,
  letterSpacing: 0.4,
  textTransform: "uppercase",
});

export function DataSourceNode({ data = {} }) {
  const {
    label = "Turbine Sensor",
    deviceId = "turbine-001",
    sensorType = "temperature",
    unit = "°C",
  } = data;

  return (
    <div style={{ ...cardBase, border: "2px solid #2563eb" }}>
      <span style={tagStyle("#dbeafe", "#1d4ed8")}>DATA SOURCE</span>
      <h4 style={{ margin: "10px 0 6px", fontSize: 15, color: "#0f172a" }}>{label}</h4>
      <div style={{ background: "#f8fafc", padding: 9, borderRadius: 8, fontSize: 12, color: "#475569" }}>
        <div>Device: <strong>{deviceId}</strong></div>
        <div>Sensor: <strong>{sensorType}</strong> ({unit})</div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: "#2563eb", width: 10, height: 10 }} />
    </div>
  );
}

export function MovingAverageNode({ data = {} }) {
  const { label = "Moving Average Filter", windowSize = 5 } = data;

  return (
    <div style={{ ...cardBase, border: "2px solid #0891b2" }}>
      <Handle type="target" position={Position.Left} style={{ background: "#0891b2", width: 10, height: 10 }} />
      <span style={tagStyle("#cffafe", "#0e7490")}>MOVING AVERAGE</span>
      <h4 style={{ margin: "10px 0 6px", fontSize: 15, color: "#0f172a" }}>{label}</h4>
      <div style={{ background: "#f8fafc", padding: 9, borderRadius: 8, fontSize: 12, color: "#475569" }}>
        Window Size: <strong>{windowSize} readings</strong>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: "#0891b2", width: 10, height: 10 }} />
    </div>
  );
}

export function MathNode({ data = {} }) {
  const { label = "Scale / Offset", operation = "multiply", factor = 1.0 } = data;

  return (
    <div style={{ ...cardBase, border: "2px solid #7c3aed" }}>
      <Handle type="target" position={Position.Left} style={{ background: "#7c3aed", width: 10, height: 10 }} />
      <span style={tagStyle("#ede9fe", "#6d28d9")}>MATH OPERATION</span>
      <h4 style={{ margin: "10px 0 6px", fontSize: 15, color: "#0f172a" }}>{label}</h4>
      <div style={{ background: "#f8fafc", padding: 9, borderRadius: 8, fontSize: 12, color: "#475569" }}>
        Op: <strong>{operation}</strong> ({factor})
      </div>
      <Handle type="source" position={Position.Right} style={{ background: "#7c3aed", width: 10, height: 10 }} />
    </div>
  );
}

export function SmsAlertNode({ data = {} }) {
  const {
    label = "SMS Alert",
    alertType = "sms",
    message = "High turbine temperature detected",
  } = data;

  return (
    <div style={{ ...cardBase, border: "2px solid #dc2626" }}>
      <Handle type="target" position={Position.Left} style={{ background: "#dc2626", width: 10, height: 10 }} />
      <span style={tagStyle("#fee2e2", "#b91c1c")}>ACTION: {alertType}</span>
      <h4 style={{ margin: "10px 0 6px", fontSize: 15, color: "#0f172a" }}>{label}</h4>
      <div style={{ background: "#fef2f2", padding: 9, borderRadius: 8, fontSize: 12, color: "#991b1b" }}>
        {message}
      </div>
    </div>
  );
}