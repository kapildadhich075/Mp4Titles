// server.js
import express from "express";
import { configDotenv } from "dotenv";
import fileUpload from "express-fileupload";
import cors from "cors";
import subRoutes from "./routes/sub.routes.js"; // Updated to match the actual file name

const app = express();

configDotenv();
const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || "development";

app.use(fileUpload());
app.use(express.json());
app.use(
  cors({
    origin: ["https://mp4titles.netlify.app/", "http://localhost:5173"],
    credentials: true,
  })
);

app.use("/api/subs", subRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
