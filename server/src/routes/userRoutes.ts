import express from 'express';
import { authenticateToken } from '../middleware/auth'; // Предполагаем, что middleware находится здесь
// Импортируем функции контроллера пользователя. Создадим их позже, если нет.
import { login, register, getCurrentUser } from '../controllers/userController';

const router = express.Router();

// Маршрут для регистрации пользователя
router.post('/register', register);

// Маршрут для логина пользователя
router.post('/login', login);

// Маршрут для получения данных текущего аутентифицированного пользователя
// Защищен middleware аутентификации
router.get('/me', authenticateToken, getCurrentUser);

export default router; 