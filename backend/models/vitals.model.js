import mongoose from "mongoose";

const vitalsSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		date: {
			type: Date,
			required: true,
			default: Date.now,
		},
		bloodPressure: {
			systolic: {
				type: Number,
				required: false,
				min: 50,
				max: 300,
			},
			diastolic: {
				type: Number,
				required: false,
				min: 30,
				max: 200,
			},
		},
		bloodSugar: {
			value: {
				type: Number,
				required: false,
				min: 0,
				max: 1000,
			},
			unit: {
				type: String,
				enum: ["mg/dL", "mmol/L"],
				default: "mg/dL",
			},
			type: {
				type: String,
				enum: ["fasting", "post_prandial", "random", "hba1c"],
				required: false,
			},
		},
		weight: {
			value: {
				type: Number,
				required: false,
				min: 0,
				max: 500,
			},
			unit: {
				type: String,
				enum: ["kg", "lbs"],
				default: "kg",
			},
		},
		height: {
			value: {
				type: Number,
				required: false,
				min: 0,
				max: 300,
			},
			unit: {
				type: String,
				enum: ["cm", "ft"],
				default: "cm",
			},
		},
		heartRate: {
			type: Number,
			required: false,
			min: 30,
			max: 300,
		},
		temperature: {
			value: {
				type: Number,
				required: false,
				min: 30,
				max: 45,
			},
			unit: {
				type: String,
				enum: ["celsius", "fahrenheit"],
				default: "celsius",
			},
		},
		oxygenSaturation: {
			type: Number,
			required: false,
			min: 0,
			max: 100,
		},
		notes: {
			type: String,
			required: false,
		},
		isManualEntry: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

// Calculate BMI if both weight and height are provided
vitalsSchema.virtual("bmi").get(function () {
	if (this.weight?.value && this.height?.value) {
		const weightInKg = this.weight.unit === "lbs" ? this.weight.value * 0.453592 : this.weight.value;
		const heightInM = this.height.unit === "ft" ? this.height.value * 0.3048 : this.height.value / 100;
		return (weightInKg / (heightInM * heightInM)).toFixed(1);
	}
	return null;
});

vitalsSchema.set("toJSON", { virtuals: true });

const Vitals = mongoose.model("Vitals", vitalsSchema);

export default Vitals;
