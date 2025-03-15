import express from "express";
import { addFriend } from "../controllers/userController.js";

const router = express.Router();

router.post("/add-friend", addFriend);

export default router;
