const asyncHandler = require("express-async-handler");
const { User } = require("../models");
const generateToken = require("../utils/generateToken");

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, preferredLanguage = "en", role } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ message: "User with this email already exists." });
  }

  const assignedRole = role === "admin" ? "admin" : "child";

  // Pre-save hook on User model automatically hashes the raw password
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    preferredLanguage,
    role: assignedRole,
  });

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
    },
  });
});

// @desc   Login user & get token
// @route  POST /api/auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Explicitly select hidden password field for verification
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password +passwordHash");
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = generateToken(user._id, user.role);

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
    },
  });
});

// @desc   Get current user profile
// @route  GET /api/auth/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  // req.user was already securely fetched and sanitized in authMiddleware
  res.json(req.user);
});

module.exports = {
  register,
  login,
  getMe,
};
