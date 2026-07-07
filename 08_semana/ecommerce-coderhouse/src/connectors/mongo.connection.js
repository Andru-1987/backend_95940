import mongoose from "mongoose";
import config from "../config/index.js";

const connectMongo = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
};

export default connectMongo;
