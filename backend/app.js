import "dotenv/config";
import express from "express";
import cors from "cors";
import { google } from "googleapis";
import { verifyJWT } from "./middlewares/auth.middleware.js";
import User  from "./models/user.model.js";
import jwt from "jsonwebtoken";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import groupRoutes from "./routes/group.route.js";
import movieRoutes from "./routes/movie.route.js";
import searchRoutes from "./routes/search.route.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/search", searchRoutes);

app.get("/api/auth/google-url", (req, res) => {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/contacts.readonly' // For contacts only
      ],
      prompt: "consent"
    });
  
    res.json({url});
  });
  
  app.post("/api/auth/google/callback", async (req, res) => {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: "No authorization code provided" 
      });
  
    }
    
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    try {
      // Exchange code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
  
      // Get user info from Google
      const oauth2 = google.oauth2({ 
        version: "v2", 
        auth: oauth2Client 
      });
      const { data: googleUser } = await oauth2.userinfo.get();
  
      // Check if user exists
      let user = await User.findOne({ email: googleUser.email });
      let isNewUser = false;
  
      if (!user) {
        // Create new user if doesn't exist
        isNewUser = true;
        user = new User({
          username: googleUser.email.split('@')[0] + "_" + Math.floor(Math.random() * 10000),
          email: googleUser.email,
          avatar: googleUser.picture,
          googleId: googleUser.id,
          authProvider: "google",
          tokens: { refreshToken: tokens.refresh_token }
        });
        await user.save();
      } else if (user.googleId !== googleUser.id) {
        user.googleId = googleUser.id;
        user.authProvider = "google";
        user.tokens = { refreshToken: tokens.refresh_token };
        await user.save();
      }
  
      // Generate JWT
      const jwtToken = jwt.sign(
        { _id: user._id }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: "7d" }
      );
  
      res.json({ 
        success: true, 
        jwt: jwtToken,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          bio: user.bio,
          avatar: user.avatar,
          isNewUser: isNewUser || !user.bio
        }
      });
    } catch (error) {
      console.error("Google OAuth Error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Google authentication failed",
        error: error.message 
      });
    }
  });
  app.post("/api/auth/update-bio", verifyJWT, async (req, res) => {
    const { bio } = req.body;
    console.log(req.body)
    const userId = req.user._id;
    
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      user.bio = bio;
      await user.save();
      
      res.json({ 
        success: true, 
        message: "Bio updated successfully",
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          bio: user.bio
        }
      });
    } catch (error) {
      console.error("Bio Update Error:", error);
      res.status(500).json({ success: false, message: "Failed to update bio" });
    }
  });
export default app;