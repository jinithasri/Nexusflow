import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SENSOR_CONFIG = {
  temperature: {
    label: "Temperature",
    deviceId: "turbine-001",
    unit: "°C",
    base: 72,
    threshold: 80,
    color: "#2563eb",
    fill: "rgba(37, 99, 235, 0.12)"
  },
  humidity: {
    label: "Humidity",
    deviceId: "storage-002",
    unit: "%",
    base: 62,
    threshold: 75,
    color: "#0891b2",
    fill: "rgba(8, 145, 178, 0.12)"
  },
  pressure: {
    label: "Pressure",
    deviceId: "pipeline-003",
    unit: "bar",
    base: 8.5,
    threshold: 10.5,
    color: "#7c3aed",
    fill: "rgba(124, 58, 237, 0.12)"
  },
  vibration: {
    label: "Vibration",
    deviceId: "motor-004",
    unit: "mm/s",
    base: 4.8,
    threshold: 6.5,
    color: "#d97706",
    fill: "rgba(217, 119, 6, 0.12)"
  }
};

function createInitialSeries(base) {
  const now = Date.now();
  return Array.from({ length: 12 }, (_, idx) => {
    const time = new Date(now - (11 - idx) * 2000);
    const jitter = Number(((Math.random() - 0.5) * 3).toFixed(1));
    return {
      time: time.toLocaleTimeString([], { hour12: false, minute: "2-digit", second: "2-digit" }),
      value: Number((base + jitter).toFixed(1))
    };
  });
}

export default function TelemetryChart({ initialSensor = "temperature" }) {
  const [sensorType, setSensorType] = useState(initialSensor);
  const [isStreaming, setIsStreaming] = useState(true);
  const [readings, setReadings] = useState(() =>
    createInitialSeries(SENSOR_CONFIG[initialSensor].base)
  );

  const config = SENSOR_CONFIG[sensorType];

  useEffect(() => {
    setReadings(createInitialSeries(config.base));
  }, [sensorType, config.base]);

  useEffect(() => {
    if (!isStreaming) return undefined;
    const timer = setInterval(() => {
      const nextTime = new Date().toLocaleTimeString([], {
        hour12: false,
        minute: "2-digit",
        second: "2-digit"
      });
      const delta = (Math.random() - 0.45) * (sensorType === "temperature" ? 4 : 1.2);
      setReadings((prev) => {
        const lastVal = prev[prev.length - 1]?.value ?? config.base;
        const nextVal = Number(
          Math.max(0, lastVal + delta).toFixed(1)
        );
        return [...prev.slice(-14), { time: nextTime, value: nextVal }];
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [isStreaming, sensorType, config.base]);

  const triggerSpike = () => {
    const spikeTime = new Date().toLocaleTimeString([], {
      hour12: false,
      minute: "2-digit",
      second: "2-digit"
    });
    const spikeValue = Number((config.threshold + 6.4).toFixed(1));
    setReadings((prev) => [...prev.slice(-14), { time: spikeTime, value: spikeValue }]);
  };

  const stats = useMemo(() => {
    const values = readings.map((r) => r.value);
    const current = values[values.length - 1] ?? 0;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = (values.reduce((acc, v) => acc + v, 0) / values.length).toFixed(1);
    return { current, min, max, avg, breached: current >= config.threshold };
  }, [readings, config.threshold]);

  const chartData = {
    labels: readings.map((r) => r.time),
    datasets: [
      {
        label: `${config.label} (${config.unit})`,
        data: readings.map((r) => r.value),
        borderColor: stats.breached ? "#dc2626" : config.color,
        backgroundColor: stats.breached ? "rgba(220, 38, 38, 0.14)" : config.fill,
        borderWidth: 2.5,
        pointRadius: 3.5,
        tension: 0.35,
        fill: true
      },
      {
        label: `Alert Threshold (${config.threshold} ${config.unit})`,
        data: readings.map(() => config.threshold),
        borderColor: "#ef4444",
        borderDash: [6, 6],
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 250 },
    plugins: {
      legend: { position: "top" }
    },
    scales: {
      y: {
        grid: { color: "#e2e8f0" }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <section className="nf-chart-card">
      <style>{`
        .nf-chart-card {
          background: #ffffff;
          border: 1px solid #dbe3ef;
          border-radius: 14px;
          padding: 20px;
          font-family: "Segoe UI", Arial, sans-serif;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
        }
        .nf-chart-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 16px;
        }
        .nf-chart-top h2 { margin: 0 0 4px; font-size: 18px; color: #0f172a; }
        .nf-chart-top p { margin: 0; font-size: 12px; color: #64748b; }
        .nf-chart-controls { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .nf-chart-controls select, .nf-chart-btn {
          padding: 7px 12px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          background: #f8fafc;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .nf-chart-btn-spike {
          background: #fee2e2;
          color: #b91c1c;
          border-color: #fecaca;
        }
        .nf-stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 18px;
        }
        .nf-stat-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px 14px;
        }
        .nf-stat-box span { display: block; font-size: 11px; color: #64748b; font-weight: 600; }
        .nf-stat-box strong { font-size: 18px; color: #0f172a; }
        .nf-chart-canvas { height: 300px; }
        @media (max-width: 700px) {
          .nf-stats-row { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="nf-chart-top">
        <div>
          <h2>Live Telemetry Stream — {config.deviceId}</h2>
          <p>
            Status:{" "}
            <strong style={{ color: stats.breached ? "#dc2626" : "#15803d" }}>
              {stats.breached ? "THRESHOLD BREACHED" : "NORMAL"}
            </strong>
          </p>
        </div>

        <div className="nf-chart-controls">
          <select value={sensorType} onChange={(e) => setSensorType(e.target.value)}>
            {Object.entries(SENSOR_CONFIG).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label} ({item.deviceId})
              </option>
            ))}
          </select>

          <button
            className="nf-chart-btn"
            onClick={() => setIsStreaming((prev) => !prev)}
          >
            {isStreaming ? "Pause Stream" : "Resume Stream"}
          </button>

          <button
            className="nf-chart-btn nf-chart-btn-spike"
            onClick={triggerSpike}
          >
            Simulate Spike
          </button>
        </div>
      </div>

      <div className="nf-stats-row">
        <div className="nf-stat-box">
          <span>CURRENT</span>
          <strong style={{ color: stats.breached ? "#dc2626" : "#0f172a" }}>
            {stats.current} {config.unit}
          </strong>
        </div>
        <div className="nf-stat-box">
          <span>MIN</span>
          <strong>{stats.min} {config.unit}</strong>
        </div>
        <div className="nf-stat-box">
          <span>MAX</span>
          <strong>{stats.max} {config.unit}</strong>
        </div>
        <div className="nf-stat-box">
          <span>AVERAGE</span>
          <strong>{stats.avg} {config.unit}</strong>
        </div>
      </div>

      <div className="nf-chart-canvas">
        <Line data={chartData} options={chartOptions} />
      </div>
    </section>
  );
}