import mongoose from "mongoose";

type connectionResObj = {
  isConnected?: mongoose.ConnectionStates | undefined;
};

const Connection: connectionResObj = {};

const dbConnection = async (): Promise<void> => {
  if (Connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    // Check if MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const dbConnect = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false, // Important for serverless
    });

    // Solution 1: Optional chaining
    Connection.isConnected = dbConnect.connections[0]?.readyState;

    // OR Solution 2: Check if connections array has items
    // if (dbConnect.connections.length > 0) {
    //   Connection.isConnected = dbConnect.connections[0].readyState;
    // }

    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

export default dbConnection;
