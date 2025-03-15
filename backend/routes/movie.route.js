import express from "express";
import { addMovie, getMovies } from "../controllers/movie.controller.js";

const router = express.Router();

router.post("/add", addMovie);
router.get("/movies", getMovies);

export default router;
