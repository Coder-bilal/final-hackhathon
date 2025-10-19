import express from "express";
import {
	addVitals,
	getVitals,
	getVitalsById,
	updateVitals,
	deleteVitals,
	getVitalsStats,
} from "../controllers/vitals.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Add vitals entry
router.post("/", addVitals);

// Get vitals with pagination and date filtering
router.get("/", getVitals);

// Get vitals statistics and trends
router.get("/stats", getVitalsStats);

// Get specific vitals record
router.get("/:id", getVitalsById);

// Update vitals record
router.put("/:id", updateVitals);

// Delete vitals record
router.delete("/:id", deleteVitals);

export default router;
