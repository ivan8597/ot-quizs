import express from 'express';
import { getQuestions } from '../controllers/questionController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getQuestions);

export default router; 