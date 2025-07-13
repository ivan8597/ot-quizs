import { Router } from 'express';
import { saveResult, getUserResults } from '../controllers/resultController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Сохранение результата теста
router.post('/', authenticateToken, saveResult);

// Получение результатов пользователя
router.get('/my-results', authenticateToken, getUserResults);

export default router; 