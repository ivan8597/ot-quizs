import { Request, Response } from 'express';
import { AppDataSource } from '../db/data-source';
import { Result } from '../models/result/model';
import { User } from '../models/user/model';

const resultRepository = AppDataSource.getRepository(Result);
const userRepository = AppDataSource.getRepository(User);

export const saveResult = async (req: Request, res: Response) => {
    try {
        const { score, totalQuestions, correctAnswers, answers } = req.body;
        const userId = req.user.id; // Предполагается, что middleware аутентификации добавляет user в request

        const user = await userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const result = new Result();
        result.score = score;
        result.totalQuestions = totalQuestions;
        result.correctAnswers = correctAnswers;
        result.answers = answers;
        result.user = user;

        await resultRepository.save(result);

        res.status(201).json(result);
    } catch (error) {
        console.error('Ошибка при сохранении результата:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

export const getUserResults = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;

        const results = await resultRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' }
        });

        res.json(results);
    } catch (error) {
        console.error('Ошибка при получении результатов:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
}; 