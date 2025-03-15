import express from "express";
import { addFriend } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/add-friend", addFriend);

export default router;
