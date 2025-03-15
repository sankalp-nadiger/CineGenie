import Movie from "../models/Movie.js";

export const addMovie = async (req, res) => {
  try {
    const { title, type, seasons } = req.body;
    const movie = await Movie.create({ title, type, seasons });
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } 
};