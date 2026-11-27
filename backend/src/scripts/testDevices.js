
const assert = require("node:assert/strict");

const { connectDB, closeDB } = require("../config/database");
const {
  getLatestDevices,
  getTelemetryByDevice,
} = require("../services/telemetryService");

async function testDevices() {
  try {
    await connectDB();

    console.log("\n--- Testing latest devices retrieval ---");

    const devices = await getLatestDevices();

    assert.ok(Array.isArray(devices), "Devices should be an array");

    const deviceIds = devices.map((device) => device.deviceId);
    const uniqueIds = new Set(deviceIds);

    assert.equal(
      uniqueIds.size,
      devices.length,
      "Device list should not contain duplicate devices"
    );

    console.log(`Distinct devices retrieved: ${devices.length}`);

    for (const device of devices) {
      assert.ok(device.deviceId, "Device should have a deviceId");
      assert.ok(device.sensorType, "Device should have a sensorType");
      assert.ok(Number.isFinite(device.value), "Device should have a numeric value");
      assert.ok(device.unit, "Device should have a unit");
      assert.ok(
        !Number.isNaN(new Date(device.timestamp).getTime()),
        "Device should have a valid timestamp"
      );

      const latestReading = await getTelemetryByDevice(device.deviceId, 1);

      assert.equal(
        new Date(device.timestamp).getTime(),
        new Date(latestReading[0].timestamp).getTime(),
        `Latest timestamp should match for ${device.deviceId}`
      );

      assert.equal(
        device.value,
        latestReading[0].value,
        `Latest value should match for ${device.deviceId}`
      );
    }

    console.log("No duplicate devices found");
    console.log("Latest readings verified for every device");
    console.log("All device service tests passed!");
  } catch (error) {
    console.error("Device service tests failed:", error.message);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

testDevices();
