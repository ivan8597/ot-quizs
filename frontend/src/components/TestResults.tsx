import React, { useEffect, useState } from 'react';
import { getUserResults } from '../services/api';

interface TestResult {
    id: number;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    createdAt: string;
}

const TestResults: React.FC = () => {
    const [results, setResults] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const data = await getUserResults();
                setResults(data);
            } catch (err) {
                setError('Не удалось загрузить результаты');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    if (loading) {
        return <div>Загрузка результатов...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="test-results">
            <h2>История результатов</h2>
            {results.length === 0 ? (
                <p>У вас пока нет результатов тестов</p>
            ) : (
                <div className="results-list">
                    {results.map((result) => (
                        <div key={result.id} className="result-item">
                            <div className="result-header">
                                <span className="date">
                                    {new Date(result.createdAt).toLocaleString()}
                                </span>
                                <span className="score">
                                    {Math.round(result.score)}%
                                </span>
                            </div>
                            <div className="result-details">
                                <p>Правильных ответов: {result.correctAnswers} из {result.totalQuestions}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TestResults; 