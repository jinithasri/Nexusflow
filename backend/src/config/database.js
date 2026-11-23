const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const { MongoClient } = require("mongodb");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "nexusflow";

const COLLECTION_NAME = "telemetry";

let client;
let database;
let telemetryCollection;

async function connectDB() {
  if (!uri) {
    throw new Error("MONGODB_URI is missing from backend/.env");
  }

  try {
    client = new MongoClient(uri);

    await client.connect();

    database = client.db(dbName);

    // Verify the database connection
    await database.command({ ping: 1 });

    console.log("MongoDB connected successfully");
    console.log(`Database: ${dbName}`);

    // Check whether the Time-Series collection exists
    const existingCollection = await database
      .listCollections(
        { name: COLLECTION_NAME },
        { nameOnly: true }
      )
      .toArray();

    if (existingCollection.length === 0) {
      await database.createCollection(COLLECTION_NAME, {
        timeseries: {
          timeField: "timestamp",
          metaField: "metadata",
          granularity: "seconds",
        },
      });

      console.log("Time-Series collection created");
    } else {
      console.log("Telemetry collection already exists");
    }

    telemetryCollection = database.collection(COLLECTION_NAME);

    console.log("Time-Series collection ready");

    return database;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    if (client) {
      await client.close().catch(() => {});
    }

    client = null;
    database = null;
    telemetryCollection = null;

    throw error;
  }
}

function getDatabase() {
  if (!database) {
    throw new Error("Database is not connected");
  }

  return database;
}

function getTelemetryCollection() {
  if (!telemetryCollection) {
    throw new Error("Telemetry collection is not ready");
  }

  return telemetryCollection;
}

async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    database = null;
    telemetryCollection = null;

    console.log("MongoDB connection closed");
  }
}

module.exports = {
  connectDB,
  getDatabase,
  getTelemetryCollection,
  closeDB,
};
