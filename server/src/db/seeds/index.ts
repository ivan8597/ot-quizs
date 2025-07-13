import { AppDataSource } from '../data-source';
import { Question } from '../../models/question/model';
import { questions } from './questions';

export const runSeeds = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database connection initialized');

        const questionRepository = AppDataSource.getRepository(Question);

        // Очищаем таблицу вопросов
        await questionRepository.clear();
        console.log('Questions table cleared');

        // Добавляем новые вопросы
        await questionRepository.save(questions);
        console.log('Questions seeded successfully');

        await AppDataSource.destroy();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
};

// Запускаем сиды, если файл запущен напрямую
if (require.main === module) {
    runSeeds();
} 