import express from "express";
import { AppDataSource } from "../../db/data-source";
import { Result } from "../../models/result/model";
import { User } from "../../models/user/model";
import { authenticateToken } from "../../middleware/auth";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  console.log('Received result data:', req.body);
  const { score, totalQuestions, correctAnswers, answers } = req.body;
  const userId = req.user.id;

  try {
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    if (!user) {
      console.error('User not found for ID:', userId);
      return res.status(404).json({ message: "User not found" });
    }

    const result = AppDataSource.getRepository(Result).create({
      score,
      totalQuestions,
      correctAnswers,
      answers,
      user,
    });
    console.log('Created Result entity:', result);
    await AppDataSource.getRepository(Result).save(result);
    console.log('Result saved successfully:', result.id);
    res.status(201).json(result);
  } catch (error) {
    console.error("Failed to save result:", error);
    res.status(500).json({ message: "Failed to save result", error });
  }
});

router.get("/my-results", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const results = await AppDataSource.getRepository(Result)
      .createQueryBuilder("result")
      .where("result.userId = :userId", { userId })
      .orderBy("result.createdAt", "DESC")
      .getMany();
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch results", error });
  }
});

export default router;