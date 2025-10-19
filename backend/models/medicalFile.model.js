import mongoose from "mongoose";

const medicalFileSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		fileName: {
			type: String,
			required: true,
		},
		originalName: {
			type: String,
			required: true,
		},
		fileUrl: {
			type: String,
			required: true,
		},
		fileType: {
			type: String,
			required: true,
			enum: ["pdf", "image", "document"],
		},
		reportType: {
			type: String,
			required: true,
			enum: [
				"blood_test",
				"urine_test", 
				"x_ray",
				"ultrasound",
				"ct_scan",
				"mri",
				"ecg",
				"prescription",
				"other"
			],
		},
		reportDate: {
			type: Date,
			required: true,
		},
		hospitalName: {
			type: String,
			required: false,
		},
		doctorName: {
			type: String,
			required: false,
		},
		notes: {
			type: String,
			required: false,
		},
		fileSize: {
			type: Number,
			required: true,
		},
		cloudinaryId: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const MedicalFile = mongoose.model("MedicalFile", medicalFileSchema);

export default MedicalFile;
