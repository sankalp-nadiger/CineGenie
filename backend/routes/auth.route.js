import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/auth.controller.js";
import User from "../models/user.model.js";
import { google } from "googleapis";
import jwt from "jsonwebtoken";

const router = express.Router();

// Variable to track signing-in state
let isSigning = false;

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

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
router.get("/auth/google-url", (req, res) => {
    const oauth2Client = signupOAuthClient;
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ],
    });

    res.json({ url });
});

router.post("/auth/google/callback", async (req, res) => {
    isSigning = true; // Start signing process
    const { code } = req.body;
    console.log('Received code:', code);

    if (!code) {
        isSigning = false;
        return res.status(400).json({
            success: false,
            message: "No authorization code provided"
        });
    }

    const oauth2Client = signupOAuthClient;
    try {
        const { tokens } = await oauth2Client.getToken({
            code: code,
            redirect_uri: oauth2Client.redirectUri
        });

        console.log('Token exchange successful');
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
        const { data: googleUser } = await oauth2.userinfo.get();

        let user = await User.findOne({ email: googleUser.email });
        if (user) {
            isSigning = false;
            return res.status(409).json({
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
                    refreshToken: tokens.refresh_token
                },
            });
            await user.save();
        } else {
            user.tokens = {
                googleFitToken: tokens.access_token,
                refreshToken: tokens.refresh_token
            };
            await user.save();
        }

        const activity = getRandomActivity();
        const jwtToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        isSigning = false; // Reset signing status
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
        isSigning = false; // Reset signing status on error
        res.status(500).json({
            success: false,
            message: "Google authentication failed",
            error: error.message
        });
    }
});

router.get("/auth/login-google", async (req, res) => {
    const oauth2Client = loginOAuthClient;
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            "https://www.googleapis.com/auth/userinfo.profile",
        ],
        prompt: "consent",
    });

    res.json({ url: authUrl });
});

router.post("/auth/google/check-login", async (req, res) => {
    isSigning = true; // Start signing process
    const { code } = req.body;
    console.log(code);

    if (!code) {
        isSigning = false;
        return res.status(400).json({ success: false, message: "No authorization code provided" });
    }

    const oauth2Client = loginOAuthClient;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
        const { data: googleUser } = await oauth2.userinfo.get();

        let user = await User.findOne({ email: googleUser.email });

        if (!user) {
            isSigning = false;
            return res.status(404).json({ success: false, message: "User does not exist. Please sign up first." });
        }

        user.tokens.googleFitToken = tokens.access_token;
        user.tokens.googleFitTokenExpiry = Date.now() + tokens.expiry_date;

        if (tokens.refresh_token) {
            user.tokens.refreshToken = tokens.refresh_token;
        }

        await user.save();

        const jwtToken = jwt.sign(
            { _id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        isSigning = false; // Reset signing status
        res.json({ success: true, jwt: jwtToken, user, suggestedActivity: getRandomActivity() });

    } catch (error) {
        console.error("Google OAuth Error:", error);
        isSigning = false; // Reset signing status on error
        res.status(500).json({ success: false, message: "Google authentication failed" });
    }
});

export default router;