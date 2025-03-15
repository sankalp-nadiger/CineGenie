import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["Movie", "Series"], required: true },
  seasons: [
    {
      number: Number,
      episodes: [{ title: String, episodeNumber: Number }],
    },
  ],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

const Movie = mongoose.model("Movie", MovieSchema);
export default Movie;
