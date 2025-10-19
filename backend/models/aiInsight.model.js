import mongoose from "mongoose";

const aiInsightSchema = new mongoose.Schema(
	{
		medicalFile: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "MedicalFile",
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		summary: {
			english: {
				type: String,
				required: true,
			},
			urdu: {
				type: String,
				required: true,
			},
		},
		abnormalValues: [
			{
				testName: String,
				value: String,
				normalRange: String,
				severity: {
					type: String,
					enum: ["low", "normal", "high", "critical"],
				},
				explanation: {
					english: String,
					urdu: String,
				},
			},
		],
		doctorQuestions: [
			{
				question: {
					english: String,
					urdu: String,
				},
			},
		],
		dietaryAdvice: {
			foodsToAvoid: [
				{
					name: {
						english: String,
						urdu: String,
					},
					reason: {
						english: String,
						urdu: String,
					},
				},
			],
			foodsToEat: [
				{
					name: {
						english: String,
						urdu: String,
					},
					reason: {
						english: String,
						urdu: String,
					},
				},
			],
		},
		homeRemedies: [
			{
				remedy: {
					english: String,
					urdu: String,
				},
				instructions: {
					english: String,
					urdu: String,
				},
			},
		],
		overallHealthStatus: {
			type: String,
			enum: ["excellent", "good", "fair", "poor", "critical"],
			required: true,
		},
		confidence: {
			type: Number,
			min: 0,
			max: 100,
			required: true,
		},
		disclaimer: {
			english: {
				type: String,
				default: "This AI analysis is for educational purposes only. Always consult your doctor before making any medical decisions.",
			},
			urdu: {
				type: String,
				default: "Yeh AI analysis sirf educational purposes ke liye hai. Koi bhi medical decision lene se pehle apne doctor se zaroor consult karein.",
			},
		},
	},
	{
		timestamps: true,
	}
);

const AiInsight = mongoose.model("AiInsight", aiInsightSchema);

export default AiInsight;
