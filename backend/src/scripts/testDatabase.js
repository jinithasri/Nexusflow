
const {
  connectDB,
  getDatabase,
  getTelemetryCollection,
  closeDB,
} = require("../config/database");

async function testDatabase() {
  try {
    await connectDB();

    const db = getDatabase();
    const collection = getTelemetryCollection();

    // Verify the database name
    console.log("Connected database:", db.databaseName);

    // Verify the collection
    console.log("Telemetry collection:", collection.collectionName);

    // Verify the collection configuration
    const collectionInfo = await db
      .listCollections(
        { name: "telemetry" },
        { nameOnly: false }
      )
      .toArray();

    console.log(
      "Time-Series configuration:",
      collectionInfo[0]?.options?.timeseries
    );

    console.log("Database tests completed successfully");
  } catch (error) {
    console.error("Database test failed:", error.message);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

testDatabase();
