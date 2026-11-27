import React from "react";
import { Handle, Position } from "@xyflow/react";

export default function RuleNode({ data = {} }) {
  const {
    title = "High Temperature",
    sensor = "Temperature",
    operator = ">",
    threshold = 75,
    unit = "°C",
    severity = "critical",
    enabled = true
  } = data;

  const severityColors = {
    info: "#2563eb",
    warning: "#d97706",
    critical: "#dc2626"
  };

  const severityColor =
    severityColors[severity.toLowerCase()] || "#64748b";

  return (
    <div style={{
      width: 230,
      padding: 18,
      background: "#ffffff",
      border: "1px solid #dbe3ef",
      borderRadius: 12,
      boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
      fontFamily: "Arial, sans-serif"
    }}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#64748b", width: 9, height: 9 }}
      />

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <span style={{
          fontSize: 10,
          color: "#64748b",
          fontWeight: "bold"
        }}>
          CONDITION NODE
        </span>

        <span style={{
          fontSize: 10,
          color: enabled ? "#15803d" : "#dc2626"
        }}>
          ● {enabled ? "ACTIVE" : "DISABLED"}
        </span>
      </div>

      <h3 style={{
        fontSize: 16,
        color: "#172033",
        margin: "14px 0"
      }}>
        {title}
      </h3>

      <div style={{
        background: "#f1f5f9",
        padding: 12,
        borderRadius: 8
      }}>
        <p style={{
          fontSize: 12,
          color: "#64748b",
          margin: "0 0 8px"
        }}>
          {sensor}
        </p>

        <strong style={{ fontSize: 19, color: "#172033" }}>
          {operator} {threshold} {unit}
        </strong>
      </div>

      <div style={{
        marginTop: 14,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <span style={{ fontSize: 11, color: "#64748b" }}>
          Alert Severity
        </span>

        <span style={{
          color: severityColor,
          fontSize: 11,
          fontWeight: "bold",
          textTransform: "uppercase"
        }}>
          {severity}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#64748b", width: 9, height: 9 }}
      />
    </div>
  );
}
