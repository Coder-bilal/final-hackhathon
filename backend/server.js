import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import mongoose from "mongoose";

import authRoutes from "./routes/auth.route.js";
import medicalFileRoutes from "./routes/medicalFile.route.js";
import familyMemberRoutes from "./routes/familyMember.route.js";
import vitalsRoutes from "./routes/vitals.route.js";

import { connectDB } from "./lib/db.js";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Set environment variables directly if not loaded
// Removed localhost fallback - use .env file for MongoDB Atlas connection
// if (!process.env.MONGO_URI) {
// 	process.env.MONGO_URI = "mongodb://localhost:27017/healthmate";
// }
if (!process.env.JWT_SECRET) {
	process.env.JWT_SECRET = "farhan_healthmate_2024_secure_jwt_key_123456789";
}
if (!process.env.CLOUDINARY_CLOUD_NAME) {
	process.env.CLOUDINARY_CLOUD_NAME = "donx3kwwx";
}
if (!process.env.CLOUDINARY_API_KEY) {
	process.env.CLOUDINARY_API_KEY = "928578277827456";
}
if (!process.env.CLOUDINARY_API_SECRET) {
	process.env.CLOUDINARY_API_SECRET = "n-ErVExygaB76j6VgRYVmkCFTbk";
}
if (!process.env.GEMINI_API_KEY) {
	process.env.GEMINI_API_KEY = "AIzaSyBmXm7QZ5y1JyP5lg5iKCThOvWwcSSEuWY";
}
if (!process.env.FRONTEND_URL) {
	process.env.FRONTEND_URL = "http://localhost:3000";
}

if (process.env.NODE_ENV === "development") {
	console.log("Environment check:");
	console.log("MONGO_URI:", process.env.MONGO_URI ? "Found" : "Not found");
	console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Found" : "Not found");
	console.log("Current directory:", __dirname);
}

const app = express();
let PORT = Number(process.env.PORT) || 5000;

// Ensure DB connection in serverless before handling requests
app.use(async (req, res, next) => {
	try {
		if (mongoose.connection.readyState !== 1) {
			await connectDB();
		}
		next();
	} catch (e) {
		next(e);
	}
});

// Middleware

// CORS: reflect request origin and handle preflight
app.use((req, res, next) => {
	const origin = req.headers.origin;

	// In development, allow all localhost origins
	if (process.env.NODE_ENV === "development") {
		if (origin && origin.includes("localhost")) {
			res.header("Access-Control-Allow-Origin", origin);
			res.header("Access-Control-Allow-Credentials", "true");
			res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
			res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
		}
	} else {
		// Production: only allow specific origins
		const allowed = new Set([
			process.env.FRONTEND_URL || "http://localhost:3000",
			"http://localhost:3001",
			"http://localhost:5173",
			"https://final-hackhathon-3ojb.vercel.app", // ✅ Add this line
		]);
		if (origin && allowed.has(origin)) {
			res.header("Access-Control-Allow-Origin", origin);
			res.header("Access-Control-Allow-Credentials", "true");
			res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
			res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
		}
	}

	if (req.method === "OPTIONS") {
		return res.sendStatus(204);
	}
	next();
});
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", medicalFileRoutes);
app.use("/api/vitals", vitalsRoutes);
app.use("/api/family", familyMemberRoutes);
app.get("/", (req, res) => {
	res.send("HealthMate API is running. Please use the frontend.");
});

// Health check endpoint
app.get("/api/health", (req, res) => {
	res.json({
		success: true,
		message: "HealthMate API is running!",
		timestamp: new Date().toISOString()
	});
});

// Quiet favicon requests to avoid 404 noise
app.get('/favicon.ico', (req, res) => res.status(204).end());

// // Serve static files in production
// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static(path.join(__dirname, "/frontend/dist")));

// 	app.get("*", (req, res) => {
// 		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// 	});
// }

// Error handling middleware
app.use((err, req, res, next) => {
	console.error("==ERROR==", err.stack || err);
	res.status(500).json({
		success: false,
		message: "Something went wrong!",
		error: process.env.NODE_ENV !== "production" ? (err.message || String(err)) : "Internal server error",
	});
});

if (process.env.NODE_ENV !== "test") {
	const startServer = (attemptsLeft = 5) => {
		const server = app.listen(PORT, () => {
			console.log(`🚀 HealthMate Server is running on http://localhost:${PORT}`);
			console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
			connectDB();
		});

		server.on("error", (err) => {
			if (err && err.code === "EADDRINUSE" && attemptsLeft > 0) {
				console.warn(`Port ${PORT} in use. Trying ${PORT + 1}...`);
				PORT += 1;
				startServer(attemptsLeft - 1);
			} else {
				console.error("Failed to start server:", err?.message || err);
				process.exit(1);
			}
		});
	};

	startServer();
}

export default app;