import app from "./src/app.js";
import config from "./src/config/index.js";
// import { connectToMongoDB } from "./src/connections/mongo.connnect.js";
import { connectToMongoDB } from "./src/connections/mongoose.connect.js";

app.listen(config.PORT, async () => {
    try {
        await connectToMongoDB();
        console.log(`Server is running on port ${config.PORT}`);
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1);
    }
});
