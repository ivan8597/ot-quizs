import React from "react";
import { TestResultHistory } from "../types/results";

interface ResultsHistoryProps {
  results: TestResultHistory[];
}

const ResultsHistory: React.FC<ResultsHistoryProps> = ({ results }) => {
  return (
    <div className="results-history">
      <h2>История результатов</h2>
      {results.map((result) => (
        <div key={result.id} className="result-item">
          <div className="result-header">
            <span className="date">{new Date(result.createdAt).toLocaleDateString()}</span>
            <span className="user">{result.user.name}</span>
          </div>
          <div className="result-details">
            <p>Правильных ответов: {result.correctAnswers} из {result.totalQuestions}</p>
            <p>Процент выполнения: {Math.round(result.score)}%</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsHistory; 