import multer from "multer";
import cloudinary from "../lib/cloudinary.js";
import MedicalFile from "../models/medicalFile.model.js";
import AiInsight from "../models/aiInsight.model.js";
import { analyzeMedicalReport } from "../lib/gemini.js";

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
	storage,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB limit
	},
	fileFilter: (req, file, cb) => {
		const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
		if (allowedTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error("Invalid file type. Only JPEG, PNG, and PDF files are allowed."), false);
		}
	},
});

export const uploadMedicalFile = async (req, res) => {
	try {
		const { reportType, reportDate, hospitalName, doctorName, notes } = req.body;
		const file = req.file;

		if (!file) {
			return res.status(400).json({
				success: false,
				message: "No file uploaded",
			});
		}

		// Upload to Cloudinary
		const result = await cloudinary.uploader.upload_stream(
			{
				resource_type: "auto",
				folder: "healthmate/medical-reports",
			},
			async (error, result) => {
				if (error) {
					return res.status(500).json({
						success: false,
						message: "Error uploading file",
						error: error.message,
					});
				}

				try {
					// Save file info to database
					const medicalFile = new MedicalFile({
						user: req.user._id,
						fileName: result.public_id,
						originalName: file.originalname,
						fileUrl: result.secure_url,
						fileType: file.mimetype.includes("image") ? "image" : "pdf",
						reportType,
						reportDate: new Date(reportDate),
						hospitalName,
						doctorName,
						notes,
						fileSize: file.size,
						cloudinaryId: result.public_id,
					});

					await medicalFile.save();

					// Analyze with Gemini AI
					const aiAnalysis = await analyzeMedicalReport(result.secure_url, reportType);

					// Save AI insights
					const aiInsight = new AiInsight({
						medicalFile: medicalFile._id,
						user: req.user._id,
						...aiAnalysis,
					});

					await aiInsight.save();

					res.status(201).json({
						success: true,
						message: "File uploaded and analyzed successfully",
						file: medicalFile,
						aiInsight,
					});
				} catch (dbError) {
					// Delete uploaded file if database save fails
					await cloudinary.uploader.destroy(result.public_id);
					throw dbError;
				}
			}
		);

		// Send file buffer to Cloudinary
		cloudinary.uploader.upload_stream(
			{
				resource_type: "auto",
				folder: "healthmate/medical-reports",
			},
			result
		).end(file.buffer);

	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error uploading file",
			error: error.message,
		});
	}
};

export const getMedicalFiles = async (req, res) => {
	try {
		const files = await MedicalFile.find({ user: req.user._id })
			.populate("aiInsight")
			.sort({ reportDate: -1 });

		res.status(200).json({
			success: true,
			files,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching medical files",
			error: error.message,
		});
	}
};

export const getMedicalFileById = async (req, res) => {
	try {
		const { id } = req.params;
		
		const file = await MedicalFile.findOne({ 
			_id: id, 
			user: req.user._id 
		}).populate("aiInsight");

		if (!file) {
			return res.status(404).json({
				success: false,
				message: "Medical file not found",
			});
		}

		res.status(200).json({
			success: true,
			file,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching medical file",
			error: error.message,
		});
	}
};

export const deleteMedicalFile = async (req, res) => {
	try {
		const { id } = req.params;
		
		const file = await MedicalFile.findOne({ 
			_id: id, 
			user: req.user._id 
		});

		if (!file) {
			return res.status(404).json({
				success: false,
				message: "Medical file not found",
			});
		}

		// Delete from Cloudinary
		await cloudinary.uploader.destroy(file.cloudinaryId);

		// Delete AI insights
		await AiInsight.deleteMany({ medicalFile: file._id });

		// Delete file record
		await MedicalFile.findByIdAndDelete(file._id);

		res.status(200).json({
			success: true,
			message: "Medical file deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error deleting medical file",
			error: error.message,
		});
	}
};

export { upload };
