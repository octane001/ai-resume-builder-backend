// controllers/userController.js

import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// POST: /api/users/register
export const registerUser = async (req, res) => {
  try {
    

    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate token and remove password before sending response
    const token = generateToken(newUser._id);
    newUser.password = undefined;

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// POST: /api/users/login
export const loginUser = async (req, res) => {
  try {
    

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Validate password
    const isMatch = user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token and remove password before sending response
    const token = generateToken(user._id);
    user.password = undefined;

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// GET: /api/users/data
export const getUserById = async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = undefined;

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Controllers for getting user resume
// GET : /api/user/resume
export const getUserResumes = async (req, res) => {
  try {
    const userId = req.userId;
    

    // Return user ids
    const resumes = await Resume.find({ userId });
    return res.status(200).json({ resumes });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
