import mongoose from "mongoose";

export const connectDB = async () => {
	try {
        const explicitUri = process.env.MONGO_URI && String(process.env.MONGO_URI).trim();
        const dbName = (process.env.MONGO_DB_NAME && String(process.env.MONGO_DB_NAME).trim()) || "healthmate";
        const fallbackUri = `mongodb://127.0.0.1:27017/${dbName}`;

        const uriToUse = explicitUri || fallbackUri;
        if (!explicitUri) {
            console.warn("MONGO_URI not set. Falling back to local MongoDB:", fallbackUri);
        }

        const conn = await mongoose.connect(uriToUse, {
            dbName: dbName,
        });
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.log("Error connecting to MONGODB", error.message);
		process.exit(1);
	}
};
