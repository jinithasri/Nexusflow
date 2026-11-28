
const { getTelemetryCollection } = require("../config/database");

function validateTelemetry(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    throw new Error("Telemetry record must be an object");
  }

  const { deviceId, sensorType, value, unit, timestamp } = record;

  if (typeof deviceId !== "string" || !deviceId.trim()) {
    throw new Error("deviceId is required");
  }

  if (typeof sensorType !== "string" || !sensorType.trim()) {
    throw new Error("sensorType is required");
  }

  if (typeof unit !== "string" || !unit.trim()) {
    throw new Error("unit is required");
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("value must be a valid finite number");
  }

  const parsedTimestamp = new Date(timestamp);

  if (!timestamp || Number.isNaN(parsedTimestamp.getTime())) {
    throw new Error("timestamp must be a valid date");
  }

  return {
    timestamp: parsedTimestamp,
    metadata: {
      deviceId: deviceId.trim(),
      sensorType: sensorType.trim(),
      unit: unit.trim(),
    },
    value,
  };
}

async function insertTelemetry(record) {
  const document = validateTelemetry(record);
  const result = await getTelemetryCollection().insertOne(document);

  return {
    insertedId: result.insertedId,
    ...document,
  };
}

async function insertManyTelemetry(records) {
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error("Provide a non-empty array of telemetry records");
  }

  const documents = records.map(validateTelemetry);
  const result = await getTelemetryCollection().insertMany(documents);

  return {
    insertedCount: result.insertedCount,
    insertedIds: result.insertedIds,
  };
}

async function getTelemetryByDevice(deviceId, limit = 100) {
  if (typeof deviceId !== "string" || !deviceId.trim()) {
    throw new Error("A valid deviceId is required");
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 1000) {
    throw new Error("limit must be an integer between 1 and 1000");
  }

  return getTelemetryCollection()
    .find({ "metadata.deviceId": deviceId.trim() })
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray();
}

async function getTelemetryByTimeRange(deviceId, startTime, endTime) {
  if (typeof deviceId !== "string" || !deviceId.trim()) {
    throw new Error("A valid deviceId is required");
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (
    !startTime ||
    !endTime ||
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    throw new Error("Valid startTime and endTime are required");
  }

  if (start > end) {
    throw new Error("startTime must be earlier than or equal to endTime");
  }

  return getTelemetryCollection()
    .find({
      "metadata.deviceId": deviceId.trim(),
      timestamp: { $gte: start, $lte: end },
    })
    .sort({ timestamp: 1 })
    .toArray();
}

// Get online threshold from environment.
// Default: 5 minutes (300,000 milliseconds).
function getOnlineThresholdMs() {
  const configuredThreshold = Number(
    process.env.DEVICE_ONLINE_THRESHOLD_MS
  );

  if (
    Number.isFinite(configuredThreshold) &&
    configuredThreshold > 0
  ) {
    return configuredThreshold;
  }

  return 5 * 60 * 1000;
}

// Determine device status from its latest telemetry timestamp.
function getDeviceStatus(
  timestamp,
  now = Date.now(),
  thresholdMs = getOnlineThresholdMs()
) {
  const timestampMs = new Date(timestamp).getTime();

  if (Number.isNaN(timestampMs)) {
    return "offline";
  }

  const ageMs = now - timestampMs;

  return ageMs >= 0 && ageMs <= thresholdMs
    ? "online"
    : "offline";
}

// Get distinct devices with their latest telemetry and status.
async function getLatestDevices() {
  const devices = await getTelemetryCollection()
    .aggregate([
      {
        $sort: {
          timestamp: -1,
        },
      },
      {
        $group: {
          _id: "$metadata.deviceId",
          latest: {
            $first: "$$ROOT",
          },
        },
      },
      {
        $project: {
          _id: 0,
          deviceId: "$_id",
          sensorType: "$latest.metadata.sensorType",
          value: "$latest.value",
          unit: "$latest.metadata.unit",
          timestamp: "$latest.timestamp",
        },
      },
      {
        $sort: {
          deviceId: 1,
        },
      },
    ])
    .toArray();

  return devices.map((device) => ({
    ...device,
    status: getDeviceStatus(device.timestamp),
  }));
}

module.exports = {
  insertTelemetry,
  insertManyTelemetry,
  getTelemetryByDevice,
  getTelemetryByTimeRange,
  getLatestDevices,
  getDeviceStatus,
};
