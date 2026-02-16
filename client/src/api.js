import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
});

export const getFeeds = () => api.get('/feeds').then(r => r.data);
export const addFeed = (url, category_id) => api.post('/feeds', { url, category_id }).then(r => r.data);
export const deleteFeed = (id) => api.delete(`/feeds/${id}`).then(r => r.data);
export const getCategories = () => api.get('/categories').then(r => r.data);
export const addCategory = (name) => api.post('/categories', { name }).then(r => r.data);
export const getArticles = (params) => api.get('/items', { params }).then(r => r.data);
export const markRead = (id) => api.post(`/items/${id}/read`).then(r => r.data);
export const toggleStar = (id, starred) => api.post(`/items/${id}/star`, { starred }).then(r => r.data);
export const refreshFeeds = () => api.post('/refresh').then(r => r.data);

export default api;
