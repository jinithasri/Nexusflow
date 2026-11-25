import React, { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import RuleBuilder from "./pages/RuleBuilder";
import Alerts from "./pages/Alerts";
import TelemetryChart from "./components/TelemetryChart";
import DeviceCard from "./components/DeviceCard";
import { checkBackendHealth } from "./services/api";

const FEATURED_DEVICES = [
  { name: "Turbine Sensor A1", deviceId: "turbine-001", type: "Temperature", value: 82.4, unit: "°C", status: "online" },
  { name: "Storage Humidity B2", deviceId: "storage-002", type: "Humidity", value: 64.0, unit: "%", status: "online" },
  { name: "Pipeline Pressure C3", deviceId: "pipeline-003", type: "Pressure", value: 8.2, unit: "bar", status: "offline" },
  { name: "Motor Vibration D4", deviceId: "motor-004", type: "Vibration", value: 5.6, unit: "mm/s", status: "online" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [apiOnline, setApiOnline] = useState(false);

  useEffect(() => {
    checkBackendHealth()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fa", fontFamily: '"Segoe UI", Arial, sans-serif' }}>
      <nav style={{
        background: "#0f172a",
        color: "#f8fafc",
        padding: "12px 26px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
        borderBottom: "1px solid #1e293b",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
          <strong style={{ fontSize: 18, letterSpacing: 0.4, color: "#38bdf8" }}>
            NexusFlow
          </strong>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { id: "dashboard", label: "Dashboard & Live Charts" },
              { id: "rules", label: "Visual Rule Engine" },
              { id: "alerts", label: "Alerts Console" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "none",
                  background: activeTab === tab.id ? "#2563eb" : "transparent",
                  color: activeTab === tab.id ? "#ffffff" : "#cbd5e1",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <span style={{
          padding: "5px 12px",
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 700,
          background: apiOnline ? "#064e3b" : "#451a03",
          color: apiOnline ? "#6ee7b7" : "#fcd34d",
        }}>
          ● {apiOnline ? "Backend API Connected" : "Live Simulation Mode"}
        </span>
      </nav>

      {activeTab === "dashboard" && (
        <div>
          <Dashboard />
          <section style={{ padding: "0 32px 28px" }}>
            <TelemetryChart initialSensor="temperature" />
          </section>
          <section style={{
            padding: "0 32px 36px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}>
            {FEATURED_DEVICES.map((dev) => (
              <DeviceCard key={dev.deviceId} {...dev} />
            ))}
          </section>
        </div>
      )}

      {activeTab === "rules" && <RuleBuilder />}
      {activeTab === "alerts" && <Alerts />}
    </div>
  );
}