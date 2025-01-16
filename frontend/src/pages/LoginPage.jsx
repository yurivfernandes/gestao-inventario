import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginPage.css';
import logo from '../assets/logo_login.svg';
import api from '../services/api'; // Import the api module

function LoginPage() {
  useEffect(() => {
    document.title = 'Gestão de Inventário - Login';
  }, []);

  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    keepLoggedIn: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Recuperar credenciais salvas
    const savedCredentials = localStorage.getItem('savedCredentials');
    if (savedCredentials) {
      const { username, keepLoggedIn } = JSON.parse(savedCredentials);
      setFormData(prev => ({
        ...prev,
        username,
        keepLoggedIn: keepLoggedIn || false
      }));
    }
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('access/login/', formData);
      
      if (response.data && response.data.token) {
        // Salvar credenciais apenas se keepLoggedIn estiver marcado
        if (formData.keepLoggedIn) {
          const credentialsToSave = {
            username: formData.username,
            keepLoggedIn: true
          };
          localStorage.setItem('savedCredentials', JSON.stringify(credentialsToSave));
        } else {
          localStorage.removeItem('savedCredentials');
        }

        localStorage.setItem('token', response.data.token);
        login(response.data.token);
        navigate('/welcome');
      } else {
        setError('Resposta inválida do servidor');
        console.error('Resposta inesperada:', response.data);
      }
    } catch (err) {
      console.error('Erro completo:', err.response?.data || err);
      setError(err.response?.data?.error || 'Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Link to="/">
            <img src={logo} alt="Gestão de Inventário Logo" height="40" />
          </Link>
          <h2>Bem-vindo de volta</h2>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              id="username"
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="keep-logged-in">
            <input
              type="checkbox"
              id="keepLoggedIn"
              name="keepLoggedIn"
              checked={formData.keepLoggedIn}
              onChange={handleChange}
            />
            <label htmlFor="keepLoggedIn">Manter conectado</label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
