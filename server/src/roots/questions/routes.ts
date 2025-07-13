import express from "express";
import { AppDataSource } from "../../db/data-source";
import { Question } from "../../models/question/model";
import { authenticateToken } from "../../middleware/auth";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const questions = await AppDataSource.getRepository(Question).find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch questions", error });
  }
});

export default router;