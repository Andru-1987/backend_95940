import app from "./src/app.js";
import config from "./src/config/index.js";
import connectMongo from "./src/connectors/mongo.connection.js";

const port = config.port;

app.listen(port, async () => {
    try {
        await connectMongo();
        console.log(`Server is running on port ${port}`);
    } catch (error) {
        console.error(error);
    }
});
