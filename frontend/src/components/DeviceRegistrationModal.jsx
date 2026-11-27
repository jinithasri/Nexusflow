import React, { useState } from "react";

const INITIAL_FORM = {
  deviceId: "",
  deviceName: "",
  deviceType: "Temperature",
  location: "",
  status: "online",
};

export default function DeviceRegistrationModal({ isOpen, onClose, onRegister }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.deviceId.trim() || !form.deviceName.trim() || !form.location.trim()) {
      setError("Device ID, Device Name, and Location are required.");
      return;
    }

    onRegister?.({
      ...form,
      deviceId: form.deviceId.trim(),
      deviceName: form.deviceName.trim(),
      location: form.location.trim(),
      createdAt: new Date().toISOString(),
    });

    setForm(INITIAL_FORM);
    onClose?.();
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: 16,
      fontFamily: '"Segoe UI", Arial, sans-serif',
    }}>
      <div style={{
        background: "#ffffff",
        width: "100%",
        maxWidth: 440,
        borderRadius: 14,
        padding: 24,
        boxShadow: "0 20px 45px rgba(15, 23, 42, 0.2)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>Register IoT Device</h2>
          <button
            type="button"
            onClick={onClose}
            style={{ border: "none", background: "transparent", fontSize: 20, cursor: "pointer", color: "#64748b" }}
          >
            ×
          </button>
        </div>

        {error && (
          <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "8px 12px", borderRadius: 8, fontSize: 12, marginBottom: 12 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
              Device ID
            </label>
            <input
              name="deviceId"
              placeholder="e.g. turbine-005"
              value={form.deviceId}
              onChange={handleChange}
              style={{ width: "100%", padding: "9px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
              Device Name
            </label>
            <input
              name="deviceName"
              placeholder="e.g. Cooling Pump Sensor E5"
              value={form.deviceName}
              onChange={handleChange}
              style={{ width: "100%", padding: "9px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                Sensor Type
              </label>
              <select
                name="deviceType"
                value={form.deviceType}
                onChange={handleChange}
                style={{ width: "100%", padding: "9px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
              >
                <option value="Temperature">Temperature</option>
                <option value="Humidity">Humidity</option>
                <option value="Pressure">Pressure</option>
                <option value="Vibration">Vibration</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                Initial Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={{ width: "100%", padding: "9px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
              Location
            </label>
            <input
              name="location"
              placeholder="e.g. Assembly Line 2"
              value={form.location}
              onChange={handleChange}
              style={{ width: "100%", padding: "9px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: "9px 14px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#f8fafc", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: "9px 16px", borderRadius: 8, border: "none", background: "#2563eb", color: "#ffffff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              Register Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}