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
		title: {
			type: String,
			required: false,
		},
		testName: {
			type: String,
			required: false,
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
		price: {
			type: Number,
			required: false,
			min: 0,
		},
		fileSize: {
			type: Number,
			required: true,
		},
		cloudinaryId: {
			type: String,
			required: true,
		},
		familyMemberId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "FamilyMember",
			required: false
		},
		// Vitals
		bpSystolic: {
			type: Number,
			required: false,
			min: 0,
		},
		bpDiastolic: {
			type: Number,
			required: false,
			min: 0,
		},
		sugar: {
			type: Number,
			required: false,
			min: 0,
		},
	},
	{
		timestamps: true,
	}
);

const MedicalFile = mongoose.model("MedicalFile", medicalFileSchema);

export default MedicalFile;
