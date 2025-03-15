import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import User from "../models/User.js";
import { google } from "googleapis";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

const SIGNUP_REDIRECT_URI = "http://localhost:3000/up-loading";
const LOGIN_REDIRECT_URI = "http://localhost:3000/in-loading";

const signupOAuthClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    SIGNUP_REDIRECT_URI
);

const loginOAuthClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    LOGIN_REDIRECT_URI
);
  
  // Route to Start Google OAuth
  app.get("/auth/google-url", (req, res) => {
    const oauth2Client = signupOAuthClient;
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
      ],
    });
  
    res.json({url});
  });

router.post("/auth/google/callback", async (req, res) => {
    const { code } = req.body;
    console.log('Received code:', code);

    if (!code) {
        return res.status(400).json({ 
            success: false, 
            message: "No authorization code provided" 
        });
    }
    const oauth2Client = signupOAuthClient;
    try {
        // Exchange code for tokens with correct parameters
        const { tokens } = await oauth2Client.getToken({
            code: code,
            redirect_uri: oauth2Client.redirectUri  // This is crucial
        });
        
        console.log('Token exchange successful');
        oauth2Client.setCredentials(tokens);

        // Get user info from Google
        const oauth2 = google.oauth2({ 
            version: "v2", 
            auth: oauth2Client 
        });
        const { data: googleUser } = await oauth2.userinfo.get();

        // Store user info in database
        let user = await User.findOne({ email: googleUser.email });
        if (user) {
            return res.status(409).json({  // 409 Conflict for already existing user
                success: false,
                message: "User already exists. Please sign in instead."
            });
        }

        if (!user) {
            user = new User({
                fullName: `${googleUser.given_name} ${googleUser.family_name}`,
                email: googleUser.email,
                avatar: googleUser.picture,
                googleId: googleUser.id,
                authProvider: "google",
                username: googleUser.email.split('@')[0] + "_" + Math.floor(Math.random() * 10000),
                tokens: { 
                    googleFitToken: tokens.access_token,
                    googleFitTokenExpiry: new Date(tokens.expiry_date),
                    refreshToken: tokens.refresh_token  // Store refresh token if available
                },
            });
            await user.save();
        } else {
            // Update existing user's tokens
            user.tokens = { 
                googleFitToken: tokens.access_token,
                refreshToken: tokens.refresh_token
            };
            await user.save();
        }
        const activity= getRandomActivity();
        const jwtToken = jwt.sign(
            { userId: user._id }, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: "7d" }
        );
        console.log(jwtToken);
        res.json({ 
            success: true, 
            jwt: jwtToken, 
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                avatar: user.avatar,
                suggestedActivity: activity
            } 
        });

    } catch (error) {
        console.error("Google OAuth Error:", error);
        console.error("Error details:", {
            message: error.message,
            response: error.response?.data
        });
        
        res.status(500).json({ 
            success: false, 
            message: "Google authentication failed",
            error: error.message 
        });
    }
});


router.get("/auth/login-google", async (req, res) => {
  // Generate Google OAuth URL for fresh token each time
  const oauth2Client = loginOAuthClient;
  const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope:[
        'https://www.googleapis.com/auth/userinfo.email',
        "https://www.googleapis.com/auth/userinfo.profile",
      ],
      prompt: "consent",
  });

  res.json({ url: authUrl });
});

router.post("/auth/google/check-login", async (req, res) => {
  const { code } = req.body;
    console.log(code)
  if (!code) {
      return res.status(400).json({ success: false, message: "No authorization code provided" });
  }
  const oauth2Client = loginOAuthClient;
  try {
      // Exchange code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // Get user info from Google
      const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
      const { data: googleUser } = await oauth2.userinfo.get();

      // Check if user exists in the database
      let user = await User.findOne({ email: googleUser.email });

      if (!user) {
          return res.status(404).json({ success: false, message: "User does not exist. Please sign up first." });
      }
      if (user) {
        // Update access & refresh tokens
        user.tokens.googleFitToken = tokens.access_token;
        user.tokens.googleFitTokenExpiry = Date.now() + tokens.expiry_date;
    
        // Only update refresh token if a new one is provided
        if (tokens.refresh_token) {
            user.tokens.refreshToken = tokens.refresh_token;
        }
    
        await user.save();
    }
    
      // Generate JWT for the existing user
      const jwtToken = jwt.sign(
        { _id: user._id },  // Ensure _id is used to match the verifyJWT function
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
    
      console.log(jwtToken)
      res.json({ success: true, jwt: jwtToken, user , suggestedActivity: activity });

  } catch (error) {
      console.error("Google OAuth Error:", error);
      res.status(500).json({ success: false, message: "Google authentication failed" });
  }
});
export default router;
