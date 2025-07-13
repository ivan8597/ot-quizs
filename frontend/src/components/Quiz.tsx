import React, { useState } from "react";
import { Question } from "../types/index";
import { TestResultsData } from "../types/results";
import '../styles/Test.css';

interface QuizProps {
  questions: Question[];
  onComplete: (results: TestResultsData) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (optionId: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionId;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const questionResults = questions.map((question, index) => ({
        question,
        userAnswer: answers[index] || 0,
        isCorrect: answers[index] === question.correctOptionId
      }));

      const correctAnswers = questionResults.filter(result => result.isCorrect).length;

      const results: TestResultsData = {
        score: (correctAnswers / questions.length) * 100,
        totalQuestions: questions.length,
        correctAnswers,
        questionResults,
        answers: answers.reduce((acc, answer, index) => ({
          ...acc,
          [questions[index].id]: answer || 0
        }), {})
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
    <div className="quiz">
      <div className="question">
        <h3>Вопрос {currentQuestionIndex + 1} из {questions.length}</h3>
        <p>{currentQuestion.text}</p>
        {/* {currentQuestion.ntd && (
          <div className="ntd-link">
            
          </div>
        )} */}
        <div className="options">
          {currentQuestion.options.map((option) => (
            <label key={option.id} className="option">
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option.id}
                checked={answers[currentQuestionIndex] === option.id}
                onChange={() => handleAnswer(option.id)}
              />
              {option.text}
            </label>
          ))}
        </div>
      </div>
      <div className="navigation">
        <button 
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Назад
        </button>
        <button 
          onClick={handleNext}
          disabled={answers[currentQuestionIndex] === null}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Завершить' : 'Далее'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;