/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";

interface ConnectionType {
  isConnected?: number;
}

const connection: ConnectionType = {};

async function connect(): Promise<void> {
  if (connection.isConnected) {
    return;
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      return;
    }
    await mongoose.disconnect();
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "");

    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    throw new Error("Database connection failed"+error);
  }
}

async function disconnect(): Promise<void> {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      try {
        await mongoose.disconnect();
        connection.isConnected = 0;
      } catch (error) {
        throw new Error("Database disconnection failed"+error);
      }
    } else {
    }
  }
}

function convertDocToObj(doc: any) {
  if (doc == null) {
    return null;
  } else {
    doc._id = doc._id.toString();
    doc.createdAt = doc.createdAt.toString();
    doc.updatedAt = doc.updatedAt.toString();
    return doc;
  }
}

const db = { connect, disconnect, convertDocToObj };
export default db;
