import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticateToken = async (req, res, next) => {
	try {
		const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Access denied. No token provided.",
			});
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid token. User not found.",
			});
		}

		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: "Invalid token.",
		});
	}
};

export const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET not found in environment variables!");
    throw new Error("Missing JWT_SECRET");
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
