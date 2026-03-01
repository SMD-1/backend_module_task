import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { success, error as sendError } from "../utils/response.js";
import logger from "../utils/logger.js";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, "User with this email already exists");
    }

    const user = await User.create({ name, email, password });

    return success(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token: generateToken(user._id),
      },
      "User registered successfully",
    );
  } catch (error) {
    logger.error("registerUser error: %O", error);
    // duplicate key? (race condition)
    if (error.code === 11000) {
      return sendError(res, 409, "Email already in use");
    }
    return sendError(res, 500, "Server error");
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return sendError(res, 401, "Invalid email or password");
    }

    return success(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token: generateToken(user._id),
      },
      "Login successful",
    );
  } catch (error) {
    logger.error("loginUser error: %O", error);
    return sendError(res, 500, "Server error");
  }
};

export { registerUser, loginUser };
