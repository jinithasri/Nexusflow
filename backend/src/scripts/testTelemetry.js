
const {
  connectDB,
  closeDB,
} = require("../config/database");

const {
  insertTelemetry,
  insertManyTelemetry,
  getTelemetryByDevice,
  getTelemetryByTimeRange,
} = require("../services/telemetryService");

async function testTelemetry() {
  try {
    await connectDB();

    const now = new Date();
    const deviceId = `nexusflow-test-${Date.now()}`;

    console.log("\n--- Testing single insertion ---");

    const singleResult = await insertTelemetry({
      deviceId,
      sensorType: "temperature",
      value: 85,
      unit: "celsius",
      timestamp: now,
    });

    console.log("Single record inserted:", singleResult.insertedId);

    console.log("\n--- Testing batch insertion ---");

    const batchResult = await insertManyTelemetry([
      {
        deviceId,
        sensorType: "temperature",
        value: 87,
        unit: "celsius",
        timestamp: new Date(now.getTime() - 20000),
      },
      {
        deviceId,
        sensorType: "temperature",
        value: 89,
        unit: "celsius",
        timestamp: new Date(now.getTime() - 10000),
      },
    ]);

    console.log("Batch records inserted:", batchResult.insertedCount);

    console.log("\n--- Testing device retrieval ---");

    const deviceRecords = await getTelemetryByDevice(deviceId);

    console.log("Records retrieved:", deviceRecords.length);
    console.log(deviceRecords);

    console.log("\n--- Testing time-range retrieval ---");

    const rangeRecords = await getTelemetryByTimeRange(
      deviceId,
      new Date(now.getTime() - 60000),
      new Date(now.getTime() + 60000)
    );

    console.log("Records in time range:", rangeRecords.length);

    if (
      deviceRecords.length !== 3 ||
      rangeRecords.length !== 3 ||
      batchResult.insertedCount !== 2
    ) {
      throw new Error("One or more telemetry tests failed");
    }

    console.log("\nAll telemetry tests passed!");
  } catch (error) {
    console.error("\nTelemetry test failed:", error.message);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

testTelemetry();
