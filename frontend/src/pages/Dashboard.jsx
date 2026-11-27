import React from "react";

const devices = [
  {
    id: "DEV-001",
    name: "Temperature Sensor A1",
    type: "Temperature",
    value: "28.4 °C",
    status: "Online",
    location: "Production Floor"
  },
  {
    id: "DEV-002",
    name: "Humidity Sensor B2",
    type: "Humidity",
    value: "64 %",
    status: "Online",
    location: "Storage Room"
  },
  {
    id: "DEV-003",
    name: "Pressure Sensor C3",
    type: "Pressure",
    value: "8.2 bar",
    status: "Offline",
    location: "Pipeline Unit"
  },
  {
    id: "DEV-004",
    name: "Vibration Sensor D4",
    type: "Vibration",
    value: "5.6 mm/s",
    status: "Online",
    location: "Motor Section"
  }
];

function MetricCard({ title, value, description }) {
  return (
    <div className="metric-card">
      <p>{title}</p>
      <h2>{value}</h2>
      <span>{description}</span>
    </div>
  );
}

export default function Dashboard() {
  const onlineDevices = devices.filter(
    device => device.status === "Online"
  ).length;

  return (
    <main className="dashboard">
      <style>{`
        * { box-sizing: border-box; }

        .dashboard {
          min-height: 100vh;
          padding: 32px;
          background: #f4f6fa;
          color: #172033;
          font-family: Arial, sans-serif;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 30px;
        }

        .dashboard-header h1 {
          margin: 0 0 8px;
          font-size: 28px;
        }

        .dashboard-header p {
          color: #718096;
          margin: 0;
        }

        .live-label {
          background: #dcfce7;
          color: #15803d;
          padding: 10px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: bold;
        }

        .metric-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 32px;
        }

        .metric-card {
          background: white;
          padding: 22px;
          border-radius: 12px;
          border: 1px solid #e5eaf1;
        }

        .metric-card p {
          color: #718096;
          margin: 0;
          font-size: 14px;
        }

        .metric-card h2 {
          font-size: 30px;
          margin: 12px 0 6px;
        }

        .metric-card span {
          color: #94a3b8;
          font-size: 12px;
        }

        .device-section {
          background: white;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e5eaf1;
          overflow-x: auto;
        }

        .device-section h2 {
          margin-top: 0;
          font-size: 19px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 650px;
        }

        th, td {
          padding: 16px 12px;
          text-align: left;
          border-bottom: 1px solid #edf0f5;
          font-size: 14px;
        }

        th {
          color: #718096;
          font-weight: 600;
        }

        .status {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }

        .online {
          color: #15803d;
          background: #dcfce7;
        }

        .offline {
          color: #b91c1c;
          background: #fee2e2;
        }

        @media (max-width: 900px) {
          .metric-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 550px) {
          .dashboard { padding: 18px; }
          .metric-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <header className="dashboard-header">
        <div>
          <h1>NexusFlow Dashboard</h1>
          <p>Industrial IoT Monitoring & Device Management</p>
        </div>
        <span className="live-label">● Monitoring Overview</span>
      </header>

      <section className="metric-grid">
        <MetricCard
          title="Total Devices"
          value={devices.length}
          description="Registered IoT devices"
        />
        <MetricCard
          title="Online Devices"
          value={onlineDevices}
          description="Currently connected"
        />
        <MetricCard
          title="Offline Devices"
          value={devices.length - onlineDevices}
          description="Require attention"
        />
        <MetricCard
          title="Active Alerts"
          value="02"
          description="Pending investigation"
        />
      </section>

      <section className="device-section">
        <h2>Device Monitoring</h2>

        <table>
          <thead>
            <tr>
              <th>Device ID</th>
              <th>Device Name</th>
              <th>Sensor Type</th>
              <th>Current Reading</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {devices.map(device => (
              <tr key={device.id}>
                <td>{device.id}</td>
                <td>{device.name}</td>
                <td>{device.type}</td>
                <td>{device.value}</td>
                <td>{device.location}</td>
                <td>
                  <span
                    className={`status ${
                      device.status === "Online"
                        ? "online"
                        : "offline"
                    }`}
                  >
                    {device.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
