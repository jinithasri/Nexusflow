import React, { useMemo, useState } from "react";

const INITIAL_ALERTS = [
  {
    id: "ALT-101",
    deviceId: "turbine-001",
    sensorType: "Temperature",
    reading: "91.4 °C",
    threshold: "> 80 °C",
    severity: "critical",
    message: "Turbine temperature exceeded critical threshold",
    status: "active",
    timestamp: "2026-11-25 19:32:10",
  },
  {
    id: "ALT-102",
    deviceId: "motor-004",
    sensorType: "Vibration",
    reading: "6.8 mm/s",
    threshold: ">= 6.0 mm/s",
    severity: "warning",
    message: "Bearing vibration spike detected on Motor Section",
    status: "active",
    timestamp: "2026-11-25 19:18:45",
  },
  {
    id: "ALT-103",
    deviceId: "pipeline-003",
    sensorType: "Pressure",
    reading: "11.2 bar",
    threshold: "> 10.5 bar",
    severity: "critical",
    message: "Pipeline pressure exceeded safety limit",
    status: "acknowledged",
    timestamp: "2026-11-25 18:40:22",
  },
  {
    id: "ALT-104",
    deviceId: "storage-002",
    sensorType: "Humidity",
    reading: "76 %",
    threshold: "> 75 %",
    severity: "info",
    message: "Storage room humidity slightly above target",
    status: "resolved",
    timestamp: "2026-11-25 17:15:04",
  },
];

const SEVERITY_BADGE = {
  critical: { bg: "#fee2e2", color: "#b91c1c" },
  warning: { bg: "#fef3c7", color: "#b45309" },
  info: { bg: "#dbeafe", color: "#1d4ed8" },
};

export default function Alerts() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSeverity =
        severityFilter === "all" || alert.severity === severityFilter;
      const matchesQuery =
        alert.deviceId.toLowerCase().includes(search.toLowerCase()) ||
        alert.sensorType.toLowerCase().includes(search.toLowerCase()) ||
        alert.message.toLowerCase().includes(search.toLowerCase());
      return matchesSeverity && matchesQuery;
    });
  }, [alerts, severityFilter, search]);

  const updateStatus = (id, nextStatus) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a))
    );
  };

  const activeCount = alerts.filter((a) => a.status === "active").length;

  return (
    <main style={{ padding: "24px 28px", fontFamily: '"Segoe UI", Arial, sans-serif', background: "#f4f6fa", minHeight: "100vh" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 24, color: "#0f172a" }}>Alert Management Console</h1>
          <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
            Monitor rule-triggered IoT threshold alerts and resolution history
          </p>
        </div>
        <span style={{ background: activeCount > 0 ? "#fee2e2" : "#dcfce7", color: activeCount > 0 ? "#b91c1c" : "#15803d", padding: "8px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
          ● {activeCount} Active Alerts
        </span>
      </header>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
        <input
          type="text"
          placeholder="Search device, sensor, or message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", minWidth: 250, fontSize: 13 }}
        />
        {["all", "critical", "warning", "info"].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSeverityFilter(lvl)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              background: severityFilter === lvl ? "#0f172a" : "#ffffff",
              color: severityFilter === lvl ? "#ffffff" : "#0f172a",
              fontSize: 12,
              fontWeight: 600,
              textTransform: "capitalize",
              cursor: "pointer",
            }}
          >
            {lvl}
          </button>
        ))}
      </div>

      <section style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
          <thead>
            <tr style={{ background: "#f8fafc", color: "#64748b", fontSize: 12, textAlign: "left" }}>
              <th style={{ padding: "12px 14px" }}>ID</th>
              <th style={{ padding: "12px 14px" }}>Device</th>
              <th style={{ padding: "12px 14px" }}>Sensor &amp; Reading</th>
              <th style={{ padding: "12px 14px" }}>Severity</th>
              <th style={{ padding: "12px 14px" }}>Message</th>
              <th style={{ padding: "12px 14px" }}>Status</th>
              <th style={{ padding: "12px 14px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.map((alert) => {
              const badge = SEVERITY_BADGE[alert.severity] || SEVERITY_BADGE.info;
              return (
                <tr key={alert.id} style={{ borderTop: "1px solid #eef2f6", fontSize: 13 }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600 }}>{alert.id}</td>
                  <td style={{ padding: "12px 14px" }}>{alert.deviceId}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <strong>{alert.sensorType}</strong>: {alert.reading}{" "}
                    <span style={{ color: "#64748b", fontSize: 11 }}>({alert.threshold})</span>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ background: badge.bg, color: badge.color, padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                      {alert.severity}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px", color: "#334155" }}>{alert.message}</td>
                  <td style={{ padding: "12px 14px", textTransform: "capitalize", fontWeight: 600 }}>
                    {alert.status}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    {alert.status === "active" && (
                      <button
                        onClick={() => updateStatus(alert.id, "acknowledged")}
                        style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1", background: "#f8fafc", fontSize: 12, cursor: "pointer", marginRight: 6 }}
                      >
                        Acknowledge
                      </button>
                    )}
                    {alert.status !== "resolved" && (
                      <button
                        onClick={() => updateStatus(alert.id, "resolved")}
                        style={{ padding: "6px 10px", borderRadius: 6, border: "none", background: "#15803d", color: "#ffffff", fontSize: 12, cursor: "pointer" }}
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}