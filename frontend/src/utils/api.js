import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(err);
  }
);

export const albumsAPI = {
  getAll: (params) => api.get('/api/albums', { params }),
  getOne: (id) => api.get(`/api/albums/${id}`),
  create: (formData) => api.post('/api/albums', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/api/albums/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/api/albums/${id}`),
};

export const authAPI = {
  login: (data) => api.post('/api/auth/login', data),
  verify: () => api.get('/api/auth/verify'),
};

export const profileAPI = {
  get: () => api.get('/api/profile'),
  update: (data) => api.put('/api/profile', data),
  uploadAvatar: (formData) => api.post('/api/profile/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const photosAPI = {
  getAll: (params) => api.get('/api/photos', { params }),
  upload: (formData) => api.post('/api/photos', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/api/photos/${id}`, data),
  delete: (id) => api.delete(`/api/photos/${id}`),
};

export const achievementsAPI = {
  getAll: (params) => api.get('/api/achievements', { params }),
  create: (data) => api.post('/api/achievements', data),
  update: (id, data) => api.put(`/api/achievements/${id}`, data),
  delete: (id) => api.delete(`/api/achievements/${id}`),
};

export default api;
