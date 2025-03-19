import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Not required for OAuth users
  bio: { type: String, default: "" }, // Default empty, to be filled later
  googleId: { type: String },
  avatar: { type: String },
  authProvider: { type: String, enum: ["local", "google"], default: "local" },
  tokens: {
    refreshToken: { type: String }
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
});
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await password== this.password;
};

const User = mongoose.model("User", UserSchema);
export default User;