import Group from "../models/Group.js";

export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const group = await Group.create({ name, members });
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};