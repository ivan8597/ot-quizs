import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "./Auth.css";

interface AuthProps {
  onLogin: (token: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setEmail('');
    setPassword('');
    setName('');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const endpoint = isRegister ? "/api/users/register" : "/api/users/login";
      
      const requestData = isRegister
        ? { name, email, password }
        : { email, password };

      const response = await axios.post(`http://localhost:5003${endpoint}`, requestData);
      
      if (isRegister) {
        setSuccessMessage('Пользователь успешно зарегистрирован. Теперь войдите.');
        setIsRegister(false);
        setEmail('');
        setPassword('');
        setName('');
      } else {
        onLogin(response.data.token);
      }

    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка авторизации");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
        <input type="text" name="fakeusernameremembered" style={{display: 'none'}} autoComplete="off" />
        <h2>{isRegister ? "Регистрация" : "Вход"}</h2>
        
        {isRegister && (
          <div className="form-group">
            <label htmlFor="name">Имя</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="new-email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button type="submit" className="submit-button">
          {isRegister ? "Зарегистрироваться" : "Войти"}
        </button>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="toggle-form">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
              setSuccessMessage(null);
              setEmail('');
              setPassword('');
              setName('');
            }}
          >
            {isRegister
              ? "Уже есть аккаунт? Войти"
              : "Нет аккаунта? Зарегистрироваться"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Auth;