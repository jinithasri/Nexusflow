NexusFlow

Visual IoT Telemetry & Rule Engine

Project Overview

NexusFlow is a web-based visual automation platform that lets non-technical users build IoT rules by connecting drag-and-drop nodes. A factory manager can wire a "Turbine Sensor" node to a "Moving Average Filter" node and then to an "SMS Alert" node. The backend compiles that visual graph into a live data stream and evaluates it against incoming telemetry in real time, with no developer involved.

Key Features
Visual Graph Builder: drag-and-drop canvas for building logic pipelines
Time-Series Storage: high-ingest, append-only sensor data in MongoDB Time-Series collections
Stream Compiler: converts the saved graph JSON into RxJS Observables
Live Rule Execution: rules run in memory against streaming telemetry
Real-Time Dashboards: live charts fed by WebSockets
Alerting: webhooks and mock SMS when rules trigger
Visual Feedback: connection wires glow when data flows through them
Architecture
Sensors -> Ingestion API (HTTP/WS) -> Batch buffer -> MongoDB Time-Series
                    |
             RxJS telemetry stream
                    |
        Compiled pipelines (one per saved graph)
                    |
   Actions: webhook / SMS / WebSocket broadcast -> React canvas + charts
Technology Stack
Layer	Technology
Frontend	React, React Flow, Recharts
Backend	Node.js, Express.js
Database	MongoDB 5.0+ (Time-Series collections)
Stream engine	RxJS
Real-time	WebSockets
Project Structure
Nexusflow/
├── backend/     # Express API, ingestion, RxJS compiler, WebSocket server
├── frontend/    # React app, React Flow canvas, dashboards
├── docs/        # Graph JSON schema, API docs, diagrams
├── .gitignore
└── README.md
Getting Started
Prerequisites
Node.js 18+
MongoDB 5.0+ (local install or MongoDB Atlas)
Git
Setup
bash
# Clone the repository
git clone <repo-url>
cd Nexusflow

# Backend
cd backend
npm install
cp .env.example .env     # then fill in your values
npm run dev

# Frontend (in a new terminal)
cd frontend
npm install
npm run dev

Setup steps will be updated as the backend and frontend are scaffolded.

Team
Member	Role	Focus
Jini	Team Lead & Integration	Graph JSON contract, PR reviews, integration, demos
Jeevith	Backend & Logic Compiler	RxJS compiler, node registry, live rule execution, alerting
Rithesh	Database & Telemetry	Time-Series collections, batched ingestion, load testing
Bharath	Frontend & Dashboard	React Flow canvas, custom nodes, live charts, wire animations
Development Workflow
main: stable, demo-ready code (protected)
dev: integration branch
feature/<name>-<task>: individual work, branched from dev
Open a pull request into dev and get at least one review before merging
Commit messages follow feat:, fix:, docs:, chore:
Roadmap
Week	Backend	Frontend
1	Time-Series collections, ingestion endpoints	React app, React Flow canvas
2	RxJS graph compiler	Custom node library
Mid-review	5,000 writes/sec ingestion audit	Graph serialization to JSON
3	Live rule execution over WebSockets	Real-time dashboards
4	Webhooks and alerting	Glowing wires, polish
Final review	Dynamic rule engine on high-velocity data	No-code visual programming UI
License

For academic purposes.