
const assert = require("node:assert/strict");

const { connectDB, closeDB } = require("../config/database");

const {
  getLatestDevices,
  getTelemetryByDevice,
  getDeviceStatus,
} = require("../services/telemetryService");

async function testDevices() {
  try {
    await connectDB();

    console.log("\n--- Testing online/offline status logic ---");

    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    assert.equal(
      getDeviceStatus(
        new Date(now - 4 * 60 * 1000),
        now,
        fiveMinutes
      ),
      "online",
      "Device reporting within 5 minutes should be online"
    );

    assert.equal(
      getDeviceStatus(
        new Date(now - fiveMinutes),
        now,
        fiveMinutes
      ),
      "online",
      "Device reporting exactly at 5 minutes should be online"
    );

    assert.equal(
      getDeviceStatus(
        new Date(now - 6 * 60 * 1000),
        now,
        fiveMinutes
      ),
      "offline",
      "Device reporting after 5 minutes should be offline"
    );

    assert.equal(
      getDeviceStatus("invalid-timestamp", now, fiveMinutes),
      "offline",
      "Invalid timestamp should be offline"
    );

    console.log("Online/offline threshold tests passed");

    console.log("\n--- Testing latest devices retrieval ---");

    const devices = await getLatestDevices();

    assert.ok(
      Array.isArray(devices),
      "Devices should be returned as an array"
    );

    const deviceIds = devices.map((device) => device.deviceId);
    const uniqueIds = new Set(deviceIds);

    assert.equal(
      uniqueIds.size,
      devices.length,
      "Device list should not contain duplicates"
    );

    console.log(`Distinct devices retrieved: ${devices.length}`);

    for (const device of devices) {
      assert.ok(device.deviceId, "Device should have a deviceId");
      assert.ok(device.sensorType, "Device should have a sensorType");

      assert.ok(
        Number.isFinite(device.value),
        "Device should have a numeric value"
      );

      assert.ok(device.unit, "Device should have a unit");

      assert.ok(
        !Number.isNaN(new Date(device.timestamp).getTime()),
        "Device should have a valid timestamp"
      );

      assert.ok(
        ["online", "offline"].includes(device.status),
        "Device should have a valid status"
      );

      const latestReading = await getTelemetryByDevice(
        device.deviceId,
        1
      );

      assert.ok(
        latestReading.length > 0,
        "Device should have a telemetry reading"
      );

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
    console.log("Device status fields verified");
    console.log("All device service tests passed!");
  } catch (error) {
    console.error("Device service tests failed:", error.message);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

testDevices();
