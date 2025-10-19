import Vitals from "../models/vitals.model.js";

export const addVitals = async (req, res) => {
	try {
		const {
			date,
			bloodPressure,
			bloodSugar,
			weight,
			height,
			heartRate,
			temperature,
			oxygenSaturation,
			notes,
		} = req.body;

		const vitals = new Vitals({
			user: req.user._id,
			date: date ? new Date(date) : new Date(),
			bloodPressure,
			bloodSugar,
			weight,
			height,
			heartRate,
			temperature,
			oxygenSaturation,
			notes,
			isManualEntry: true,
		});

		await vitals.save();

		res.status(201).json({
			success: true,
			message: "Vitals added successfully",
			vitals,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error adding vitals",
			error: error.message,
		});
	}
};

export const getVitals = async (req, res) => {
	try {
		const { page = 1, limit = 10, startDate, endDate } = req.query;
		
		const query = { user: req.user._id };
		
		// Add date range filter if provided
		if (startDate || endDate) {
			query.date = {};
			if (startDate) query.date.$gte = new Date(startDate);
			if (endDate) query.date.$lte = new Date(endDate);
		}

		const vitals = await Vitals.find(query)
			.sort({ date: -1 })
			.limit(limit * 1)
			.skip((page - 1) * limit);

		const total = await Vitals.countDocuments(query);

		res.status(200).json({
			success: true,
			vitals,
			pagination: {
				current: parseInt(page),
				pages: Math.ceil(total / limit),
				total,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching vitals",
			error: error.message,
		});
	}
};

export const getVitalsById = async (req, res) => {
	try {
		const { id } = req.params;
		
		const vitals = await Vitals.findOne({ 
			_id: id, 
			user: req.user._id 
		});

		if (!vitals) {
			return res.status(404).json({
				success: false,
				message: "Vitals record not found",
			});
		}

		res.status(200).json({
			success: true,
			vitals,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching vitals",
			error: error.message,
		});
	}
};

export const updateVitals = async (req, res) => {
	try {
		const { id } = req.params;
		const updateData = req.body;

		const vitals = await Vitals.findOneAndUpdate(
			{ _id: id, user: req.user._id },
			updateData,
			{ new: true, runValidators: true }
		);

		if (!vitals) {
			return res.status(404).json({
				success: false,
				message: "Vitals record not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Vitals updated successfully",
			vitals,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error updating vitals",
			error: error.message,
		});
	}
};

export const deleteVitals = async (req, res) => {
	try {
		const { id } = req.params;
		
		const vitals = await Vitals.findOneAndDelete({ 
			_id: id, 
			user: req.user._id 
		});

		if (!vitals) {
			return res.status(404).json({
				success: false,
				message: "Vitals record not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Vitals deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error deleting vitals",
			error: error.message,
		});
	}
};

export const getVitalsStats = async (req, res) => {
	try {
		const userId = req.user._id;
		
		// Get latest vitals for each type
		const latestVitals = await Vitals.findOne({ user: userId })
			.sort({ date: -1 });

		// Get vitals trends (last 30 days)
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const recentVitals = await Vitals.find({
			user: userId,
			date: { $gte: thirtyDaysAgo },
		}).sort({ date: 1 });

		// Calculate averages
		const stats = {
			latest: latestVitals,
			trends: recentVitals,
			averages: {},
		};

		if (recentVitals.length > 0) {
			// Calculate average blood pressure
			const bpReadings = recentVitals.filter(v => v.bloodPressure?.systolic && v.bloodPressure?.diastolic);
			if (bpReadings.length > 0) {
				stats.averages.bloodPressure = {
					systolic: Math.round(bpReadings.reduce((sum, v) => sum + v.bloodPressure.systolic, 0) / bpReadings.length),
					diastolic: Math.round(bpReadings.reduce((sum, v) => sum + v.bloodPressure.diastolic, 0) / bpReadings.length),
				};
			}

			// Calculate average blood sugar
			const sugarReadings = recentVitals.filter(v => v.bloodSugar?.value);
			if (sugarReadings.length > 0) {
				stats.averages.bloodSugar = Math.round(
					sugarReadings.reduce((sum, v) => sum + v.bloodSugar.value, 0) / sugarReadings.length
				);
			}

			// Calculate average weight
			const weightReadings = recentVitals.filter(v => v.weight?.value);
			if (weightReadings.length > 0) {
				stats.averages.weight = Math.round(
					weightReadings.reduce((sum, v) => sum + v.weight.value, 0) / weightReadings.length
				);
			}
		}

		res.status(200).json({
			success: true,
			stats,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching vitals stats",
			error: error.message,
		});
	}
};
