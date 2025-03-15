import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import groupRoutes from "./routes/group.route.js";
import movieRoutes from "./routes/movie.route.js";
import searchRoutes from "./routes/search.route.js";

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