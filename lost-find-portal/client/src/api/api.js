import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

let csrfToken = null;

const getCsrfToken = async () => {
  if (csrfToken) return csrfToken;
  const { data } = await axios.get(`${API_BASE_URL}/security/csrf-token`);
  csrfToken = data.csrfToken;
  return csrfToken;
};

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('lostFindToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const method = (config.method || 'get').toLowerCase();
  if (!['get', 'head', 'options'].includes(method)) {
    config.headers['X-CSRF-Token'] = await getCsrfToken();
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong.';
    return Promise.reject(new Error(message));
  }
);

export default api;
