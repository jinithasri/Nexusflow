const express = require("express");
const { getLatestDevices } = require("../services/telemetryService");

const router = express.Router();

// GET: List distinct devices with their latest telemetry
router.get("/", async (req, res) => {
  try {
    const devices = await getLatestDevices();

    return res.status(200).json({
      success: true,
      count: devices.length,
      data: devices,
    });
  } catch (error) {
    console.error("Device retrieval failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve devices",
    });
  }
});

module.exports = router;