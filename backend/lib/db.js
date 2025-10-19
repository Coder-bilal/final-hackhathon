import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		console.log("MONGO_URI:", process.env.MONGO_URI);
		if (!process.env.MONGO_URI) {
			throw new Error("MONGO_URI is not defined in environment variables");
		}
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.log("Error connecting to MONGODB", error.message);
		process.exit(1);
	}
};
