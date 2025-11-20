// Backend/controllers/authController.js
import User from "../models/User.js"; // make sure the path is correct
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ---------------- Sign Up ----------------
export const signup = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      subscription: "Free plan", // default
    });

    // Create JWT token (optional)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({
      message: "User created successfully",
      fullName: user.fullName,
      subscription: user.subscription,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------- Sign In ----------------
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      message: "Sign in successful",
      fullName: user.fullName,
      subscription: user.subscription,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
