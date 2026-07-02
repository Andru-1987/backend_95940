import mongoose from "mongoose";
import config from "../config/index.js";

export async function connectToMongoDB() {
    try {
        await mongoose.connect(config.MONGODB_URI);
        console.log("You successfully connected to MongoDB from mongoose!");
        return mongoose;
    } catch (err) {
        console.dir(err);
    }
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
    await mongoose.connection.close();
}
