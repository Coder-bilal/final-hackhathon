import express from "express";
import {
	uploadMedicalFile,
	getMedicalFiles,
	getMedicalFileById,
	deleteMedicalFile,
	upload,
} from "../controllers/medicalFile.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Upload medical file
router.post("/upload", upload.single("file"), uploadMedicalFile);

// Get all medical files for user
router.get("/", getMedicalFiles);

// Get specific medical file
router.get("/:id", getMedicalFileById);

// Delete medical file
router.delete("/:id", deleteMedicalFile);

export default router;
