const config = {
    mongoUri: process.env.MONGO_URI,
    version: process.env.VERSION || "1",
    port: process.env.PORT || 3000,
};

export default config;
