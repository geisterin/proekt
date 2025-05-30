import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (
      token &&
      config.url &&
      !config.url.includes('/auth/login') &&
      !config.url.includes('/auth/register-klient')
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Неавторизован - очищаем токен и перенаправляем на логин
          store.dispatch(logout());
          window.location.href = '/login';
          break;
        case 403:
          // Нет доступа
          console.error('Нет доступа к ресурсу');
          break;
        case 500:
          // Серверная ошибка
          console.error('Ошибка сервера');
          break;
        default:
          console.error('Произошла ошибка:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (
    email: string,
    parool: string,
    nimi: string,
    perekonnanimi?: string,
    telefon?: string,
    aadress?: string
  ) =>
    api.post('/auth/register-klient', {
      email,
      parool,
      nimi,
      perekonnanimi,
      telefon,
      aadress,
    }),
};

export const orderAPI = {
  getOrders: () => api.get('/tellimus/all'),
  getMyOrders: () => api.get('/tellimus/my'),
  createOrder: (orderData: any) => api.post('/orders', orderData),
  updateOrder: (id: number, orderData: any) => api.put(`/orders/${id}`, orderData),
  deleteOrder: (id: number) => api.delete(`/orders/${id}`),
  getOrderDetails: (id: number) => api.get(`/tellimus/${id}/details`),
};

export const productAPI = {
  getProducts: () => api.get('/tooted'),
  createProduct: (productData: any) => api.post('/tooted', productData),
  updateProduct: (id: number, productData: any) =>
    api.put(`/tooted/${id}`, productData),
  deleteProduct: (id: number) => api.delete(`/tooted/${id}`),
};

export const klientAPI = {
  getClients: () => api.get('/klient/all'),
};

export const brandAPI = {
  getBrands: () => api.get('/brand'),
  createBrand: (data: any) => api.post('/brand', data),
  updateBrand: (id: number, data: any) => api.put(`/brand/${id}`, data),
  deleteBrand: (id: number) => api.delete(`/brand/${id}`),
};

export const workerAPI = {
  getWorkers: () => api.get('/tootaja/all'),
  createWorker: (workerData: any) => api.post('/tootaja', workerData),
  updateWorker: (id: number, workerData: any) => api.put(`/tootaja/${id}`, workerData),
  deleteWorker: (id: number) => api.delete(`/tootaja/${id}`),
};

export const teenusedAPI = {
  getTeenused: () => api.get('/teenused'),
  createTeenus: (data: any) => api.post('/teenused', data),
  updateTeenus: (id: number, data: any) => api.put(`/teenused/${id}`, data),
  deleteTeenus: (id: number) => api.delete(`/teenused/${id}`),
};

export default api; 