import React, { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import RuleNode from "../components/RuleNode";

const SENSOR_DEFAULTS = {
  Temperature: { unit: "°C", threshold: 75, sample: 82 },
  Humidity: { unit: "%", threshold: 80, sample: 65 },
  Pressure: { unit: "bar", threshold: 10, sample: 11.4 },
  Vibration: { unit: "mm/s", threshold: 6, sample: 7.2 }
};

const PRESETS = {
  turbine: {
    name: "Turbine Overheat Protection",
    nodes: [
      {
        id: "rule-1",
        type: "ruleNode",
        position: { x: 70, y: 120 },
        data: {
          title: "High Temperature Warning",
          sensor: "Temperature",
          operator: ">",
          threshold: 75,
          unit: "°C",
          severity: "warning",
          enabled: true
        }
      },
      {
        id: "rule-2",
        type: "ruleNode",
        position: { x: 390, y: 120 },
        data: {
          title: "Critical Thermal Cutoff",
          sensor: "Temperature",
          operator: ">=",
          threshold: 90,
          unit: "°C",
          severity: "critical",
          enabled: true
        }
      },
      {
        id: "rule-3",
        type: "ruleNode",
        position: { x: 710, y: 120 },
        data: {
          title: "Pipeline Pressure Check",
          sensor: "Pressure",
          operator: ">",
          threshold: 10,
          unit: "bar",
          severity: "critical",
          enabled: true
        }
      }
    ],
    edges: [
      { id: "e1-2", source: "rule-1", target: "rule-2" },
      { id: "e2-3", source: "rule-2", target: "rule-3" }
    ]
  },
  motor: {
    name: "Motor Vibration & Humidity Guard",
    nodes: [
      {
        id: "rule-m1",
        type: "ruleNode",
        position: { x: 100, y: 130 },
        data: {
          title: "Bearing Vibration Spike",
          sensor: "Vibration",
          operator: ">=",
          threshold: 6,
          unit: "mm/s",
          severity: "critical",
          enabled: true
        }
      },
      {
        id: "rule-m2",
        type: "ruleNode",
        position: { x: 450, y: 130 },
        data: {
          title: "Motor Room Humidity",
          sensor: "Humidity",
          operator: ">",
          threshold: 75,
          unit: "%",
          severity: "warning",
          enabled: true
        }
      }
    ],
    edges: [{ id: "em1-2", source: "rule-m1", target: "rule-m2" }]
  }
};

function evaluateCondition(reading, operator, threshold) {
  switch (operator) {
    case ">":
      return reading > threshold;
    case ">=":
      return reading >= threshold;
    case "<":
      return reading < threshold;
    case "<=":
      return reading <= threshold;
    case "==":
      return reading === threshold;
    default:
      return false;
  }
}

export default function RuleBuilder() {
  const [workflowName, setWorkflowName] = useState(PRESETS.turbine.name);
  const [nodes, setNodes, onNodesChange] = useNodesState(PRESETS.turbine.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(PRESETS.turbine.edges);
  const [selectedNodeId, setSelectedNodeId] = useState("rule-1");
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);

  const [simSensor, setSimSensor] = useState("Temperature");
  const [simValue, setSimValue] = useState(82);
  const [simActive, setSimActive] = useState(true);

  const nodeTypes = useMemo(() => ({ ruleNode: RuleNode }), []);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const triggeredNodes = useMemo(() => {
    if (!simActive) return [];
    return nodes.filter(
      (n) =>
        n.data.enabled &&
        n.data.sensor === simSensor &&
        evaluateCondition(Number(simValue), n.data.operator, Number(n.data.threshold))
    );
  }, [nodes, simActive, simSensor, simValue]);

  const triggeredIds = useMemo(
    () => new Set(triggeredNodes.map((n) => n.id)),
    [triggeredNodes]
  );

  const styledEdges = useMemo(
    () =>
      edges.map((edge) => {
        const isHot =
          simActive &&
          (triggeredIds.has(edge.source) || triggeredIds.has(edge.target));
        return {
          ...edge,
          animated: true,
          style: isHot
            ? {
                stroke: "#ef4444",
                strokeWidth: 3.5,
                filter: "drop-shadow(0 0 6px rgba(239, 68, 68, 0.75))"
              }
            : { stroke: "#2563eb", strokeWidth: 2 }
        };
      }),
    [edges, simActive, triggeredIds]
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const loadPreset = (key) => {
    const preset = PRESETS[key];
    setWorkflowName(preset.name);
    setNodes(preset.nodes);
    setEdges(preset.edges);
    setSelectedNodeId(preset.nodes[0]?.id || null);
  };

  const addRuleNode = () => {
    const nextIndex = nodes.length + 1;
    const newId = `rule-${Date.now()}`;
    const newNode = {
      id: newId,
      type: "ruleNode",
      position: {
        x: 90 + (nextIndex % 3) * 290,
        y: 260 + Math.floor(nextIndex / 3) * 150
      },
      data: {
        title: `Sensor Rule ${nextIndex}`,
        sensor: "Pressure",
        operator: ">",
        threshold: 10,
        unit: "bar",
        severity: "warning",
        enabled: true
      }
    };
    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(newId);
  };

  const deleteSelectedNode = () => {
    if (!selectedNodeId) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    setEdges((eds) =>
      eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId)
    );
    setSelectedNodeId(null);
  };

  const updateSelectedNode = (field, value) => {
    if (!selectedNodeId) return;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id !== selectedNodeId) return node;
        const updatedData = { ...node.data, [field]: value };
        if (field === "sensor" && SENSOR_DEFAULTS[value]) {
          updatedData.unit = SENSOR_DEFAULTS[value].unit;
        }
        return { ...node, data: updatedData };
      })
    );
  };

  const workflowPayload = {
    name: workflowName,
    nodes: nodes.map(({ id, type, position, data }) => ({
      id,
      type,
      position,
      data
    })),
    edges: edges.map(({ id, source, target }) => ({ id, source, target }))
  };

  const copyWorkflowJson = () => {
    navigator.clipboard?.writeText(JSON.stringify(workflowPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="nf-rb">
      <style>{`
        * { box-sizing: border-box; }
        .nf-rb {
          min-height: 100vh;
          background: #f1f5f9;
          color: #0f172a;
          font-family: "Segoe UI", Arial, sans-serif;
        }
        .nf-topbar {
          background: #0f172a;
          color: #f8fafc;
          padding: 18px 26px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
        }
        .nf-topbar h1 { margin: 0 0 4px; font-size: 20px; letter-spacing: 0.2px; }
        .nf-topbar p { margin: 0; font-size: 12px; color: #94a3b8; }
        .nf-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .nf-btn {
          padding: 8px 13px;
          border-radius: 8px;
          border: 1px solid #334155;
          background: #1e293b;
          color: #f8fafc;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .nf-btn:hover { background: #334155; }
        .nf-btn-primary { background: #2563eb; border-color: #2563eb; }
        .nf-btn-primary:hover { background: #1d4ed8; }
        .nf-btn-danger {
          width: 100%;
          margin-top: 8px;
          background: #fee2e2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }
        .nf-simbar {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 12px 26px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .nf-sim-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: 13px; }
        .nf-sim-controls select, .nf-sim-controls input {
          padding: 6px 10px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 13px;
        }
        .nf-status-pill {
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }
        .nf-pill-alert { background: #fee2e2; color: #b91c1c; }
        .nf-pill-ok { background: #dcfce7; color: #15803d; }
        .nf-body {
          padding: 20px 26px;
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 18px;
        }
        .nf-canvas {
          height: 540px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
        }
        .nf-panel {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 14px;
          padding: 18px;
          height: fit-content;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
        }
        .nf-panel h2 { margin: 0 0 14px; font-size: 15px; }
        .nf-field { margin-bottom: 11px; }
        .nf-field label {
          display: block;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          color: #64748b;
          margin-bottom: 4px;
          font-weight: 700;
        }
        .nf-field input, .nf-field select {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 13px;
        }
        .nf-json-wrap { padding: 0 26px 26px; }
        .nf-json {
          background: #0f172a;
          color: #38bdf8;
          padding: 16px;
          border-radius: 12px;
          font-size: 12px;
          overflow-x: auto;
          margin: 0;
        }
        @media (max-width: 920px) {
          .nf-body { grid-template-columns: 1fr; }
        }
      `}</style>

      <header className="nf-topbar">
        <div>
          <h1>NexusFlow Visual Rule Engine</h1>
          <p>Drag, connect, simulate, and export IoT automation pipelines</p>
        </div>
        <div className="nf-actions">
          <button className="nf-btn" onClick={() => loadPreset("turbine")}>
            Preset: Turbine Overheat
          </button>
          <button className="nf-btn" onClick={() => loadPreset("motor")}>
            Preset: Motor Guard
          </button>
          <button className="nf-btn nf-btn-primary" onClick={addRuleNode}>
            + Add Rule Node
          </button>
          <button className="nf-btn" onClick={() => setShowJson((p) => !p)}>
            {showJson ? "Hide JSON" : "Workflow JSON"}
          </button>
          {showJson && (
            <button className="nf-btn" onClick={copyWorkflowJson}>
              {copied ? "Copied!" : "Copy JSON"}
            </button>
          )}
        </div>
      </header>

      <section className="nf-simbar">
        <div className="nf-sim-controls">
          <strong>Live Rule Simulator:</strong>
          <select
            value={simSensor}
            onChange={(e) => {
              const s = e.target.value;
              setSimSensor(s);
              setSimValue(SENSOR_DEFAULTS[s].sample);
            }}
          >
            {Object.keys(SENSOR_DEFAULTS).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={simValue}
            onChange={(e) => setSimValue(Number(e.target.value))}
            style={{ width: 90 }}
          />
          <span>{SENSOR_DEFAULTS[simSensor].unit}</span>
          <label style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={simActive}
              onChange={(e) => setSimActive(e.target.checked)}
            />
            Active
          </label>
        </div>

        <span
          className={`nf-status-pill ${
            triggeredNodes.length > 0 ? "nf-pill-alert" : "nf-pill-ok"
          }`}
        >
          {triggeredNodes.length > 0
            ? `● ${triggeredNodes.length} Rule Triggered (${triggeredNodes
                .map((n) => n.data.title)
                .join(", ")})`
            : "● All Conditions Normal"}
        </span>
      </section>

      <div className="nf-body">
        <section className="nf-canvas">
          <ReactFlow
            nodes={nodes}
            edges={styledEdges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            fitView
          >
            <Background gap={18} color="#cbd5e1" />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </section>

        <aside className="nf-panel">
          <h2>Inspector &amp; Configuration</h2>

          <div className="nf-field">
            <label>Workflow Name</label>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
            />
          </div>

          {selectedNode ? (
            <>
              <div className="nf-field">
                <label>Node Title</label>
                <input
                  type="text"
                  value={selectedNode.data.title}
                  onChange={(e) => updateSelectedNode("title", e.target.value)}
                />
              </div>

              <div className="nf-field">
                <label>Sensor Type</label>
                <select
                  value={selectedNode.data.sensor}
                  onChange={(e) => updateSelectedNode("sensor", e.target.value)}
                >
                  {Object.keys(SENSOR_DEFAULTS).map((sensor) => (
                    <option key={sensor} value={sensor}>
                      {sensor}
                    </option>
                  ))}
                </select>
              </div>

              <div className="nf-field">
                <label>Operator</label>
                <select
                  value={selectedNode.data.operator}
                  onChange={(e) => updateSelectedNode("operator", e.target.value)}
                >
                  <option value=">">&gt;</option>
                  <option value=">=">&gt;=</option>
                  <option value="<">&lt;</option>
                  <option value="<=">&lt;=</option>
                  <option value="==">==</option>
                </select>
              </div>

              <div className="nf-field">
                <label>Threshold ({selectedNode.data.unit})</label>
                <input
                  type="number"
                  value={selectedNode.data.threshold}
                  onChange={(e) =>
                    updateSelectedNode("threshold", Number(e.target.value))
                  }
                />
              </div>

              <div className="nf-field">
                <label>Alert Severity</label>
                <select
                  value={selectedNode.data.severity}
                  onChange={(e) => updateSelectedNode("severity", e.target.value)}
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="nf-field">
                <label>Status</label>
                <select
                  value={selectedNode.data.enabled ? "active" : "disabled"}
                  onChange={(e) =>
                    updateSelectedNode("enabled", e.target.value === "active")
                  }
                >
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              <button className="nf-btn nf-btn-danger" onClick={deleteSelectedNode}>
                Delete Selected Node
              </button>
            </>
          ) : (
            <p style={{ fontSize: 13, color: "#64748b" }}>
              Select any node on the canvas to edit or delete it.
            </p>
          )}
        </aside>
      </div>

      {showJson && (
        <section className="nf-json-wrap">
          <pre className="nf-json">
            {JSON.stringify(workflowPayload, null, 2)}
          </pre>
        </section>
      )}
    </main>
  );
}