import axios from 'axios';

// Instancia de Axios pre-configurada
const apiClient = axios.create({
  baseURL: 'https://gym-management-api-huv2.onrender.com', // API en la nube
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Agregar JWT a cada request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Manejar errores 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido — limpiar sesión
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;