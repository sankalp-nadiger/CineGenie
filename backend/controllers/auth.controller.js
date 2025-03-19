import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiResponse from "../utils/API_Response.js";
import { ApiError } from "../utils/API_Error.js";
import asyncHandler from "../utils/asynchandler.utils.js";
import { generateAccessAndRefreshTokens } from "../middlewares/auth.middleware.js";

// Utility functions

const saveUserMood = async (userId, mood) => {
  // Implement the logic to save user mood
  console.log(`Saving mood for user ${userId}: ${mood}`);
};

const getRandomActivity = () => {
  const activities = ["Watch a movie", "Read a book", "Go for a walk"];
  return activities[Math.floor(Math.random() * activities.length)];
};

// Controller functions

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { fullName, email, username, password, gender, age, location } = req.body;
    const idCardFile = req.file?.path;

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if user exists
    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) {
      return res.status(409).json({ success: false, message: "User with email or username already exists" });
    }

    if (age < 18 && !idCardFile) {
      return res.status(400).json({ success: false, message: "ID card upload mandatory for students" });
    }

    // Process location
    let parsedLocation;
    try {
      parsedLocation = JSON.parse(location);
      if (!parsedLocation.type || !parsedLocation.coordinates) {
        throw new Error("Invalid location format");
      }
    } catch (error) {
      return res.status(400).json({ success: false, message: "Invalid location JSON format" });
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      password,
      gender,
      age,
      username: username.toLowerCase(),
      idCard: idCardFile,
      location: parsedLocation,
    });

    console.log("User successfully created:", user);
    await user.assignRandomAvatar(); 
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    console.log("Generated Tokens:", { accessToken, refreshToken });

    // Cookie options
    const options = {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    };

    // Send response
    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "User registered successfully",
        data: {
          user: await User.findById(user._id).select("-password"),
          accessToken,
        },
      });

  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password, email, mood } = req.body;
  console.log("Request body:", req.body);
  if (!username) {
    throw new ApiError(400, "Username is required");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  const randomActivity = getRandomActivity();
  await saveUserMood(user._id, mood);
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refreshToken,
        suggestedActivity: randomActivity,
      }, "User logged in successfully"),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    //secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
};