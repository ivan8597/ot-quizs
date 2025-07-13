import React from 'react';
import '../styles/Test.css';
import { Question, TestResult } from '../types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface TestDetailedResultsProps {
    results: {
        score: number;
        totalQuestions: number;
        correctAnswers: number;
        questionResults: TestResult[];
    };
    questions: Question[];
    userName: string | null;
}

const TestDetailedResults: React.FC<TestDetailedResultsProps> = ({ results, questions, userName }) => {
    const getOptionText = (questionId: number, optionId: number) => {
        const question = questions.find(q => q.id === questionId);
        if (!question) return 'Вопрос не найден';
        const option = question.options.find(opt => opt.id === optionId);
        return option ? option.text : 'Ответ не найден';
    };

    const handleDownloadResults = async () => {
        const input = document.querySelector('.test-results') as HTMLElement;
        if (!input) return;

        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;

        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save('test_results.pdf');
    };

    return (
        <div className="test-results">
            <h2>Результаты теста</h2>
            {userName && <p className="user-name">Пользователь: {userName}</p>}
            <div className="results-summary">
                <p>Правильных ответов: {results.correctAnswers} из {results.totalQuestions}</p>
                <p>Процент выполнения: {Math.round(results.score)}%</p>
                <button onClick={handleDownloadResults} className="download-button">Скачать результаты (PDF)</button>
            </div>
            <div className="detailed-results">
                <h3>Детальные результаты:</h3>
                {results.questionResults.map((result, index) => (
                    <div key={index} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                        <h4>Вопрос {index + 1}</h4>
                        <p>{result.question.text}</p>
                        {result.question.ntd && (
                            <div className="ntd-reference">
                                <p>НТД: {result.question.ntd}</p>
                            </div>
                        )}
                        <div className="answer-comparison">
                            <p className={`user-answer ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                                Ваш ответ: {getOptionText(result.question.id, result.userAnswer)}
                            </p>
                            <p className="correct-answer">
                                Правильный ответ: {getOptionText(result.question.id, result.question.correctOptionId)}
                            </p>
                        </div>
                        <p className={`result-status ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                            {result.isCorrect ? '✓ Правильно' : '✗ Неправильно'}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestDetailedResults; 