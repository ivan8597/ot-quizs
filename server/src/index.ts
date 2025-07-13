import express from "express";
import cors from "cors";
import { AppDataSource } from "./db/data-source";
import questionRoutes from "./routes/questionRoutes";
import userRoutes from "./routes/userRoutes";
import resultRoutes from "./routes/resultRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5003;
app.use(cors(
  {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }
));
app.use(express.json());

app.use("/api/questions", questionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/results", resultRoutes);

AppDataSource.initialize()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));