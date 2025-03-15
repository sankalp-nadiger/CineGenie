import Movie from "../models/movie.model.js";

export const search = async (req, res) => {
  try {
    const { query } = req.query;
    const movies = await Movie.find({ title: { $regex: query, $options: "i" } });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 