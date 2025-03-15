import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

const Group = mongoose.model("Group", GroupSchema);
export default Group;
