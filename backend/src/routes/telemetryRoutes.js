
const express = require("express");

const {
  insertTelemetry,
  insertManyTelemetry,
  getTelemetryByDevice,
  getTelemetryByTimeRange,
} = require("../services/telemetryService");

const router = express.Router();

// Validate incoming telemetry
function validateRequest(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return "A valid telemetry object is required";
  }

  const { deviceId, sensorType, value, unit, timestamp } = record;

  if (typeof deviceId !== "string" || !deviceId.trim()) {
    return "deviceId is required";
  }

  if (typeof sensorType !== "string" || !sensorType.trim()) {
    return "sensorType is required";
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "value must be a valid finite number";
  }

  if (typeof unit !== "string" || !unit.trim()) {
    return "unit is required";
  }

  if (!timestamp || Number.isNaN(new Date(timestamp).getTime())) {
    return "A valid timestamp is required";
  }

  return null;
}

// POST: Insert a single telemetry reading
router.post("/", async (req, res) => {
  const validationError = validateRequest(req.body);

  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  try {
    const result = await insertTelemetry(req.body);

    return res.status(201).json({
      success: true,
      message: "Telemetry stored successfully",
      data: result,
    });
  } catch (error) {
    console.error("Telemetry insertion failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to store telemetry",
    });
  }
});

// POST: Insert multiple telemetry readings
router.post("/batch", async (req, res) => {
  const { records } = req.body;

  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Provide a non-empty records array",
    });
  }

  for (const record of records) {
    const validationError = validateRequest(record);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }
  }

  try {
    const result = await insertManyTelemetry(records);

    return res.status(201).json({
      success: true,
      message: "Batch telemetry stored successfully",
      data: result,
    });
  } catch (error) {
    console.error("Batch insertion failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to store telemetry batch",
    });
  }
});

// GET: Retrieve telemetry for a device
router.get("/", async (req, res) => {
  const { deviceId, startTime, endTime, limit } = req.query;

  if (!deviceId) {
    return res.status(400).json({
      success: false,
      message: "deviceId query parameter is required",
    });
  }

  if ((startTime && !endTime) || (!startTime && endTime)) {
    return res.status(400).json({
      success: false,
      message: "Both startTime and endTime are required",
    });
  }

  try {
    let readings;

    if (startTime && endTime) {
      readings = await getTelemetryByTimeRange(
        deviceId,
        startTime,
        endTime
      );
    } else {
      const parsedLimit = limit === undefined ? 100 : Number(limit);

      if (
  !Number.isInteger(parsedLimit) ||
  parsedLimit < 1 ||
  parsedLimit > 1000
) {
  return res.status(400).json({
    success: false,
    message: "limit must be an integer between 1 and 1000",
  });
}

      readings = await getTelemetryByDevice(deviceId, parsedLimit);
    }

    return res.status(200).json({
      success: true,
      count: readings.length,
      data: readings,
    });
  } catch (error) {
  console.error("Telemetry retrieval failed:", error.message);

  return res.status(500).json({
    success: false,
    message: "Failed to retrieve telemetry",
  });
}
  
});

module.exports = router;
