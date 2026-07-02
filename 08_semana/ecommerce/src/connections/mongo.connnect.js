import { MongoClient } from "mongodb";
import config from "../config/index.js";

const client = new MongoClient(config.MONGODB_URI);

export async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");
        return client;
    } catch (err) {
        console.dir(err);
    }
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
    await client.close();
}

export default client;
