
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB, closeDB } = require("./config/database");
const telemetryRoutes = require("./routes/telemetryRoutes");
const devicesRoutes = require("./routes/devicesRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/telemetry", telemetryRoutes);
app.use("/api/devices", devicesRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to NexusFlow API!",
    status: "Running",
    database: "Connected",
  });
});

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`NexusFlow server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();

async function shutdown() {
  console.log("Shutting down NexusFlow...");
  await closeDB();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
