import express from "express";
import { addFriend, getFriends } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add-friend", addFriend);
router.get("/friends/:userId", getFriends);


export default router;
