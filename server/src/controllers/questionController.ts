import { Request, Response } from 'express';
import { AppDataSource } from '../db/data-source';
import { Question } from '../models/question/model';

const questionRepository = AppDataSource.getRepository(Question);

function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export const getQuestions = async (req: Request, res: Response) => {
    try {
        let questions = await questionRepository.find();
        questions = shuffleArray(questions);
        res.json(questions);
    } catch (error) {
        console.error('Ошибка при получении вопросов:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
}; 