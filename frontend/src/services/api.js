import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Lista de rotas que não precisam de token
const publicRoutes = [
  'access/login/',
  'access/signup/',
];

api.interceptors.request.use(config => {
  const isPublicRoute = publicRoutes.some(route => config.url.includes(route));
  
  if (!isPublicRoute) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`; // Alterado para Token
    }
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  response => response,
  error => {
    // Removido redirecionamento automático para login em caso de erro 401
    return Promise.reject(error);
  }
);

export default api;
