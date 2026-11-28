import React from "react";

const SENSOR_TYPES = ["All", "Temperature", "Humidity", "Pressure", "Vibration"];
const STATUS_OPTIONS = ["All", "Online", "Offline"];

export default function DeviceFilterBar({
  searchQuery = "",
  onSearchChange,
  selectedType = "All",
  onTypeChange,
  selectedStatus = "All",
  onStatusChange,
  totalMatched = 0,
  onOpenRegister,
}) {
  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: "14px 18px",
        marginBottom: 18,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
        fontFamily: '"Segoe UI", Arial, sans-serif',
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Search by device ID, name, or location..."
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            minWidth: 240,
            fontSize: 13,
          }}
        />

        <select
          value={selectedType}
          onChange={(e) => onTypeChange?.(e.target.value)}
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            background: "#f8fafc",
            fontSize: 13,
          }}
        >
          {SENSOR_TYPES.map((type) => (
            <option key={type} value={type}>
              Sensor: {type}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange?.(e.target.value)}
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            background: "#f8fafc",
            fontSize: 13,
          }}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              Status: {status}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
          Showing {totalMatched} device{totalMatched === 1 ? "" : "s"}
        </span>

        {onOpenRegister && (
          <button
            type="button"
            onClick={onOpenRegister}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              background: "#2563eb",
              color: "#ffffff",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Register Device
          </button>
        )}
      </div>
    </section>
  );
}