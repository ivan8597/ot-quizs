import { Request, Response } from 'express';
import { AppDataSource } from '../db/data-source';
import { User } from '../models/user/model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DeepPartial } from 'typeorm';

// Интерфейс для расширения Request, чтобы включить свойство user
interface AuthRequest extends Request {
    user?: { id: number; email: string; } // Указываем ожидаемый тип req.user из middleware
}

const userRepository = AppDataSource.getRepository(User);
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Получаем секретный ключ для JWT из env или используем дефолтный

// Контроллер для регистрации пользователя
export const register = async (req: Request, res: Response) => {
    const { name, email, password, position } = req.body;
    console.log('Регистрация пользователя:', { name, email, position });

    try {
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Пароль захеширован');

        const newUser = userRepository.create({
            name,
            email,
            password: hashedPassword,
            position,
        } as DeepPartial<User>);

        const savedUser = await userRepository.save(newUser);
        console.log(' сохранен:', { id: savedUser.id, name: savedUser.name, email: savedUser.email });

        const token = jwt.sign({ id: savedUser.id, email: savedUser.email }, JWT_SECRET, { expiresIn: '1h' });
        console.log('Токен создан');

        res.status(201).json({ message: 'Пользователь успешно зарегистрирован', token });
    } catch (error) {
        console.error('Ошибка при регистрации пользователя:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};

// Контроллер для логина пользователя
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log('Попытка входа:', { email });

    try {
        const user = await userRepository.findOne({ 
            where: { email },
            select: ['id', 'email', 'password'] // Явно указываем нужные поля
        });
        
        console.log('Найден пользователь:', user ? 'да' : 'нет');
        
        if (!user) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password!);
        console.log('Пароль верный:', isPasswordValid);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        console.log('Токен создан успешно');

        res.status(200).json({ token });
    } catch (error) {
        console.error('Ошибка при логине пользователя:', error);
        res.status(500).json({ 
            message: 'Внутренняя ошибка сервера',
            error: error instanceof Error ? error.message : 'Неизвестная ошибка'
        });
    }
};

// Контроллер для получения данных текущего пользователя
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Пользователь не аутентифицирован' });
        }

        const user = await userRepository.findOne({ 
            where: { id: req.user.id },
            select: ['id', 'email', 'name']
        });
        
        console.log('Получены данные пользователя:', user);
        
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.json({
            id: user.id,
            email: user.email,
            name: user.name || 'Пользователь'
        });
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
}; 