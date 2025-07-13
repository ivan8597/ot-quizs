import React, { useEffect, useState, lazy, Suspense } from "react";
import Auth from "./components/Auth";
import { Question } from "./types";
import { getUserResults, fetchCurrentUser } from "./services/api";
import "./styles/Test.css";


const Test = lazy(() => import("./components/Test"));
const TestResults = lazy(() => import("./components/TestResults"));
const TestDetailedResults = lazy(() => import("./components/TestDetailedResults"));

interface User {
    id: number;
    name: string;
    email: string;
    position?: string;
}

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [completedTestResults, setCompletedTestResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      if (token) {
        try {
          setIsLoading(true);
          await Promise.all([fetchQuestions(), fetchUserData()]);
        } catch (err) {
          console.error('Ошибка инициализации:', err);
          handleLogout();
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [token]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:5003/api/questions", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        throw new Error('Требуется авторизация');
      }
      
      if (!response.ok) {
        throw new Error('Ошибка при загрузке вопросов');
      }
      
      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      console.error('Ошибка при загрузке вопросов:', err);
      if (err instanceof Error && err.message === 'Требуется авторизация') {
        handleLogout();
      } else {
        setError("Не удалось загрузить вопросы. Попробуйте позже.");
      }
    }
  };

  const fetchUserData = async () => {
    try {
      console.log('Загрузка данных пользователя...');
      const user = await fetchCurrentUser(token as string);
      console.log('Получены данные пользователя:', user);
      setCurrentUser(user);
    } catch (err) {
      console.error('Ошибка при загрузке данных пользователя:', err);
      handleLogout();
    }
  };

  const handleLogin = (newToken: string) => {
    console.log('Вход в систему...');
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    console.log('Выход из системы...');
    localStorage.removeItem("token");
    setToken(null);
    setQuestions([]);
    setIsTestCompleted(false);
    setCompletedTestResults(null);
    setCurrentUser(null);
    setError(null);
  };

  const handleTestComplete = (results: any) => {
    setIsTestCompleted(true);
    setCompletedTestResults(results);
  };

  const handleRestart = () => {
    setIsTestCompleted(false);
    setCompletedTestResults(null);
  };

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button onClick={handleLogout} className="logout-button">
          Выйти
        </button>
      </div>
    );
  }

  if (questions.length === 0 && !isTestCompleted) {
    return <div className="loading">Загрузка вопросов...</div>;
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Проверка знаний по охране труда</h1>
        {currentUser && (
          <div className="user-info">
            <span className="user-name">Сотрудник: {currentUser.name}</span>
          </div>
        )}
        <button onClick={handleLogout} className="logout-button">
          Выйти
        </button>
      </div>
      
      <Suspense fallback={<div className="loading">Загрузка компонента...</div>}>
        {!isTestCompleted ? (
          <Test 
            questions={questions} 
            onComplete={handleTestComplete} 
          />
        ) : (
          <div>
            {completedTestResults && (
              <TestDetailedResults 
                results={completedTestResults} 
                questions={questions} 
                userName={currentUser?.name || null}
              />
            )}
            <div className="completion-message">
              <h2>Тест завершен!</h2>
              <button onClick={handleRestart} className="restart-button">
                Пройти тест снова
              </button>
            </div>
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default App;