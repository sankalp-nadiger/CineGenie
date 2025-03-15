import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  rating: { type: Number, min: 0, max: 10, required: true },
  comment: { type: String },
});

const Review = mongoose.model("Review", ReviewSchema);
export default Review;
