import mongoose, { Mongoose, ConnectionStates } from "mongoose";

type connectionResObj = {
  isConnected: ConnectionStates | null; // Use ConnectionStates instead of number
};

const Connection: connectionResObj = {
  isConnected: null,
};

const dbConnection = async (): Promise<void> => {
  if (Connection.isConnected) {
    //console.log("Already connected to database");
    return;
  }
  try {
    const dbConnect: Mongoose = await mongoose.connect(
      process.env.MONGODB_URI || "",
      {}
    );
    Connection.isConnected = dbConnect.connections?.[0]?.readyState ?? null;
    //console.log("connected to mongoDB successfully");
  } catch (error) {
    console.error(error);
    //console.log("Failed to connect to the database");
    process.exit(1);
  }
};

export default dbConnection;
