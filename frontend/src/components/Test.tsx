import React, { useState } from 'react';
import { Question, TestResultsData } from '../types';
import '../styles/Test.css';
import { saveTestResult } from '../services/api';

interface TestProps {
    questions: Question[];
    onComplete: (results: TestResultsData) => void;
}

const Test: React.FC<TestProps> = ({ questions, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswer = (questionId: number, optionId: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            const questionResults = questions.map(question => ({
                question,
                userAnswer: answers[question.id] || 0,
                isCorrect: answers[question.id] === question.correctOptionId
            }));

            const correctAnswers = questionResults.filter(result => result.isCorrect).length;

            const results: TestResultsData = {
                score: (correctAnswers / questions.length) * 100,
                totalQuestions: questions.length,
                correctAnswers,
                questionResults,
                answers
            };

            onComplete(results);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    return (
        <div className="test">
            <div className="question">
                <h3>Вопрос {currentQuestionIndex + 1} из {questions.length}</h3>
                <p>{currentQuestion.text}</p>
                <div className="options">
                    {currentQuestion.options.map((option) => (
                        <label key={option.id} className="option">
                            <input
                                type="radio"
                                name={`question-${currentQuestion.id}`}
                                checked={answers[currentQuestion.id] === option.id}
                                onChange={() => handleAnswer(currentQuestion.id, option.id)}
                            />
                            <span className="option-text">{option.text}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="navigation">
                <button 
                    onClick={handleNext}
                    disabled={!answers[currentQuestion.id]}
                >
                    {currentQuestionIndex === questions.length - 1 ? 'Завершить' : 'Далее'}
                </button>
            </div>
        </div>
    );
};

export default Test;