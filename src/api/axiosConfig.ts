import axios from 'axios';

const api = axios.create({
    baseURL: 'https://edutrack-frontend-xw88.vercel.app/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para añadir el token a las solicitudes
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;