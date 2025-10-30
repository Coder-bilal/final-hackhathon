import FamilyMember from "../models/familyMember.model.js";

export const listFamilyMembers = async (req, res) => {
	try {
		const members = await FamilyMember.find({ userId: req.user._id }).sort({ createdAt: -1 });
		res.json({ success: true, members });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

export const createFamilyMember = async (req, res) => {
	try {
		const { name, relation, color } = req.body;
		if (!name || !relation) return res.status(400).json({ success: false, message: "Name and relation are required" });
		const member = await FamilyMember.create({ userId: req.user._id, name, relation, color, lastActivity: new Date() });
		res.status(201).json({ success: true, member });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

export const updateFamilyMember = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, relation, color } = req.body;
		const member = await FamilyMember.findOneAndUpdate(
			{ _id: id, userId: req.user._id },
			{ $set: { name, relation, color } },
			{ new: true }
		);
		if (!member) return res.status(404).json({ success: false, message: "Family member not found" });
		res.json({ success: true, member });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

export const deleteFamilyMember = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await FamilyMember.findOneAndDelete({ _id: id, userId: req.user._id });
		if (!result) return res.status(404).json({ success: false, message: "Family member not found" });
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

export const getFamilyMemberById = async (req, res) => {
	try {
		const { id } = req.params;
		const member = await FamilyMember.findOne({ _id: id, userId: req.user._id });
		if (!member) return res.status(404).json({ success: false, message: "Family member not found" });
		res.json({ success: true, member });
	} catch (e) {
		res.status(500).json({ success: false, message: e.message });
	}
};


