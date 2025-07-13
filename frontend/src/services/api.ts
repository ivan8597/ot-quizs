import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5003/api';

interface User {
    id: number;
    name: string;
    email: string;
}

const api = axios.create({
    baseURL: API_URL,
});

// Добавляем интерсептор для автоматического добавления токена
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const saveTestResult = async (result: {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    answers: Record<string, any>;
}) => {
    try {
        const response = await api.post('/results', result);
        return response.data;
    } catch (error) {
        console.error('Ошибка при сохранении результата:', error);
        throw error;
    }
};

export const getUserResults = async () => {
    try {
        const response = await api.get('/results/my-results');
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении результатов:', error);
        throw error;
    }
};

export const fetchCurrentUser = async (token: string): Promise<User> => {
    try {
        const response = await api.get('/users/me');
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        throw error;
    }
}; 