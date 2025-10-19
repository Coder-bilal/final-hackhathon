import User from "../models/user.model.js";
import { generateToken } from "../middleware/auth.middleware.js";

export const register = async (req, res) => {
	try {
		const { name, email, password, phone, dateOfBirth, gender } = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists with this email",
			});
		}

		// Create new user
		const user = new User({
			name,
			email,
			password,
			phone,
			dateOfBirth,
			gender,
		});

		await user.save();

		// Generate token
		const token = generateToken(user._id);

		// Set cookie
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});

		res.status(201).json({
			success: true,
			message: "User registered successfully",
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				phone: user.phone,
				dateOfBirth: user.dateOfBirth,
				gender: user.gender,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error registering user",
			error: error.message,
		});
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "Invalid email or password",
			});
		}

		// Check password
		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			return res.status(400).json({
				success: false,
				message: "Invalid email or password",
			});
		}

		// Generate token
		const token = generateToken(user._id);

		// Set cookie
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});

		res.status(200).json({
			success: true,
			message: "Login successful",
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				phone: user.phone,
				dateOfBirth: user.dateOfBirth,
				gender: user.gender,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error logging in",
			error: error.message,
		});
	}
};

export const logout = async (req, res) => {
	try {
		res.clearCookie("token");
		res.status(200).json({
			success: true,
			message: "Logout successful",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error logging out",
			error: error.message,
		});
	}
};

export const getProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
		
		res.status(200).json({
			success: true,
			token,
			user,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching profile",
			error: error.message,
		});
	}
};

export const updateProfile = async (req, res) => {
	try {
		const { name, phone, dateOfBirth, gender } = req.body;
		
		const user = await User.findByIdAndUpdate(
			req.user._id,
			{ name, phone, dateOfBirth, gender },
			{ new: true, runValidators: true }
		).select("-password");

		res.status(200).json({
			success: true,
			message: "Profile updated successfully",
			user,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error updating profile",
			error: error.message,
		});
	}
};
