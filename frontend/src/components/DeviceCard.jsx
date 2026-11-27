import React from "react";

export default function DeviceCard({
  name = "Temperature Sensor A1",
  deviceId = "DEV-001",
  type = "Temperature",
  value = 28.4,
  unit = "°C",
  status = "online"
}) {
  const isOnline = status.toLowerCase() === "online";

  return (
    <div style={{
      background: "#ffffff",
      padding: "24px",
      borderRadius: "14px",
      border: "1px solid #e2e8f0",
      fontFamily: "Arial",
      maxWidth: "350px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between"
      }}>
        <div>
          <h3 style={{ margin: "0 0 8px" }}>{name}</h3>
          <small style={{ color: "#64748b" }}>{deviceId}</small>
        </div>

        <span style={{
          background: isOnline ? "#dcfce7" : "#fee2e2",
          color: isOnline ? "#15803d" : "#b91c1c",
          padding: "7px 10px",
          borderRadius: "20px",
          fontSize: "11px",
          height: "fit-content"
        }}>
          ● {isOnline ? "ONLINE" : "OFFLINE"}
        </span>
      </div>

      <p style={{ color: "#64748b", marginTop: "25px" }}>
        {type} Reading
      </p>

      <h1 style={{ fontSize: "34px", margin: "5px 0" }}>
        {value} {unit}
      </h1>

      <p style={{ color: "#94a3b8", fontSize: "12px" }}>
        Industrial IoT Monitoring
      </p>
    </div>
  );
}
