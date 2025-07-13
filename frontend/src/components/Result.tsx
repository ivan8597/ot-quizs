import React from "react";

interface ResultProps {
  score: number;
  total: number;
  onRestart: () => void;
}

const Result: React.FC<ResultProps> = ({ score, total, onRestart }) => {
  return (
    <div className="result">
      <h2>Результат</h2>
      <p>Вы ответили правильно на {score} из {total} вопросов.</p>
      <button onClick={onRestart} className="restart-button">
        Пройти заново
      </button>
    </div>
  );
};

export default Result;