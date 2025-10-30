import express from "express";
import {
	uploadMedicalFile,
	uploadMedicalFiles,
	getMedicalFiles,
	getMedicalFileById,
	deleteMedicalFile,
	updateMedicalFile,
	upload,
} from "../controllers/medicalFile.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Upload single medical file
router.post("/upload", upload.single("file"), uploadMedicalFile);

// Upload multiple medical files
router.post("/", upload.array("files", 10), uploadMedicalFiles);

// Get all medical files for user
router.get("/", getMedicalFiles);

// Get specific medical file
router.get("/:id", getMedicalFileById);

// Update medical file metadata
router.put("/:id", updateMedicalFile);

// Delete medical file
router.delete("/:id", deleteMedicalFile);

export default router;
