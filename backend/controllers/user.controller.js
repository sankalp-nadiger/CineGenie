import User from "../models/User.js";

export const addFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    await User.findByIdAndUpdate(userId, { $push: { friends: friendId } });
    res.json({ message: "Friend added" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("friends");
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};