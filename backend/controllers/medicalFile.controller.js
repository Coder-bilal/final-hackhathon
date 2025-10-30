import multer from "multer";
import cloudinary from "../lib/cloudinary.js";
import MedicalFile from "../models/medicalFile.model.js";
import AiInsight from "../models/aiInsight.model.js";
import { analyzeMedicalReport } from "../lib/gemini.js";

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({
	storage,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB limit
	},
	fileFilter: (req, file, cb) => {
		const allowedTypes = new Set([
			"image/jpeg",
			"image/png",
			"image/jpg",
			"image/heic",
			"image/heif",
			"application/pdf",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		]);
		if (allowedTypes.has(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error("Invalid file type. Allowed: JPG, PNG, HEIC, PDF, DOC, DOCX."), false);
		}
	},
});

export const uploadMedicalFiles = async (req, res) => {
	try {
		// Basic env validation to avoid vague 500s
		if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
			return res.status(500).json({ success: false, message: "Cloudinary is not configured. Missing environment variables." });
		}

		const { reportType, reportDate, hospitalName, doctorName, notes, price, title, testName, bpSystolic, bpDiastolic, sugar, familyMemberId } = req.body;
		const files = req.files;

		if (!files || files.length === 0) {
			return res.status(400).json({
				success: false,
				message: "No files uploaded",
			});
		}

		// Process multiple files
		const uploadedFiles = [];
		for (const file of files) {
			let result = null;
			let uploadError = null;
			try {
				// Use base64 upload for reliability
				const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
				result = await cloudinary.uploader.upload(base64, {
					resource_type: "auto",
					folder: "healthmate/medical-reports",
				});
			} catch (e) {
				uploadError = e;
				// Continue without Cloudinary (metadata-only fallback)
			}

			// Map report type to enum
			const normalizeReportType = (value) => {
				const v = String(value || "other").toLowerCase().replace(/\s+/g, "_");
				const allowed = new Set(["blood_test","urine_test","x_ray","ultrasound","ct_scan","mri","ecg","prescription","other"]);
				return allowed.has(v) ? v : "other";
			};

			const testValueToSave = testName || reportType || '';

			// Save to database (match schema fields)
			const medicalFile = new MedicalFile({
				user: req.user._id,
				fileName: result?.public_id || "no-file",
				originalName: file.originalname,
				fileUrl: result?.secure_url || "N/A",
				fileType: file.mimetype.includes("image") ? "image" : (file.mimetype === 'application/pdf' ? "pdf" : "document"),
				reportType: normalizeReportType(reportType),
				testName: testValueToSave,
				title: title || undefined,
				reportDate: reportDate ? new Date(reportDate) : new Date(),
				hospitalName,
				doctorName,
				notes,
				price: price ? Number(price) : undefined,
				bpSystolic: bpSystolic ? Number(bpSystolic) : undefined,
				bpDiastolic: bpDiastolic ? Number(bpDiastolic) : undefined,
				sugar: sugar ? Number(sugar) : undefined,
				familyMemberId: familyMemberId ? familyMemberId : undefined,
				fileSize: file.size || 0,
				cloudinaryId: result?.public_id || "none",
			});

			await medicalFile.save();
			
			// If uploaded to Cloudinary successfully, generate AI insight
			if (result?.secure_url) {
				try {
					const aiAnalysis = await analyzeMedicalReport(result.secure_url, reportType);
					const aiInsight = new AiInsight({
						medicalFile: medicalFile._id,
						user: req.user._id,
						...aiAnalysis,
					});
					await aiInsight.save();
				} catch (aiErr) {
					// swallow AI errors so file save is still successful
					console.error("AI analysis failed for file", medicalFile._id, aiErr?.message || aiErr);
				}
			}

			uploadedFiles.push(medicalFile);
		}

		res.status(201).json({
			success: true,
			message: "Files processed",
			files: uploadedFiles,
		});

	} catch (error) {
		console.error("Error in uploadMedicalFiles:", error);
		res.status(500).json({
			success: false,
			message: "Error uploading files",
			error: error?.message || String(error),
		});
	}
};

export const uploadMedicalFile = async (req, res) => {
	try {
		const { reportType, reportDate, hospitalName, doctorName, notes, price, title, testName, bpSystolic, bpDiastolic, sugar, familyMemberId } = req.body;
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
						price: price ? Number(price) : undefined,
						bpSystolic: bpSystolic ? Number(bpSystolic) : undefined,
						bpDiastolic: bpDiastolic ? Number(bpDiastolic) : undefined,
						sugar: sugar ? Number(sugar) : undefined,
						familyMemberId: familyMemberId ? familyMemberId : undefined,
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
		const query = { user: req.user._id };
		if (req.query.memberId && req.query.memberId !== 'self') {
			query.familyMemberId = req.query.memberId;
		} else if (req.query.memberId === 'self') {
			query.familyMemberId = { $exists: false };
		}
		const files = await MedicalFile.find(query).sort({ reportDate: -1 });

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
		});

		if (!file) {
			return res.status(404).json({
				success: false,
				message: "Medical file not found",
			});
		}

		// Fetch AI insight linked to this file, if any
		let aiInsight = null;
		try {
			aiInsight = await AiInsight.findOne({ medicalFile: file._id, user: req.user._id });
		} catch (e) {
			// ignore, return without insight
		}

		res.status(200).json({
			success: true,
			file,
			aiInsight,
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


export const updateMedicalFile = async (req, res) => {
	try {
		const { id } = req.params;
		const { reportType, reportDate, hospitalName, doctorName, notes, price, title, testName, bpSystolic, bpDiastolic, sugar, familyMemberId } = req.body;

		const file = await MedicalFile.findOne({ _id: id, user: req.user._id });
		if (!file) {
			return res.status(404).json({ success: false, message: "Medical file not found" });
		}

		if (typeof reportType !== 'undefined') file.reportType = String(reportType);
		if (typeof title !== 'undefined') file.title = title;
		if (typeof testName !== 'undefined') file.testName = testName;
		if (typeof reportDate !== 'undefined') file.reportDate = new Date(reportDate);
		if (typeof hospitalName !== 'undefined') file.hospitalName = hospitalName;
		if (typeof doctorName !== 'undefined') file.doctorName = doctorName;
		if (typeof notes !== 'undefined') file.notes = notes;
		if (typeof price !== 'undefined') file.price = Number(price);
		if (typeof bpSystolic !== 'undefined') file.bpSystolic = Number(bpSystolic);
		if (typeof bpDiastolic !== 'undefined') file.bpDiastolic = Number(bpDiastolic);
		if (typeof sugar !== 'undefined') file.sugar = Number(sugar);
		if (typeof familyMemberId !== 'undefined') file.familyMemberId = familyMemberId;

		await file.save();

		res.status(200).json({ success: true, file });
	} catch (error) {
		res.status(500).json({ success: false, message: "Error updating medical file", error: error.message });
	}
};


