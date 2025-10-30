import mongoose from "mongoose";

const familyMemberSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
		name: { type: String, required: true, trim: true },
		relation: { type: String, required: true, trim: true },
		color: { type: String, default: "bg-pink-500" },
		lastActivity: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

const FamilyMember = mongoose.model("FamilyMember", familyMemberSchema);

export default FamilyMember;


