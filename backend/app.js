import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/group", groupRoutes);
app.use("/movie", movieRoutes);
app.use("/search", searchRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;