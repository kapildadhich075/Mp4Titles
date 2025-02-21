// server.js
import express from "express";
import { configDotenv } from "dotenv";
import fileUpload from "express-fileupload";
import cors from "cors";
import subRoutes from "./routes/sub.routes.js"; // Updated to match the actual file name

const app = express();

configDotenv();
app.use(fileUpload());
app.use(express.json());
app.use(cors());

app.use("/api/subs", subRoutes);

app.listen(process.env.PORT, () => {
  console.log("server started");
});
