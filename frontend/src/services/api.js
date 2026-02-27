import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Note: in production, use trailing env variables
});

export const fetchDashboardStats = () => API.get('/dashboard/summary');

// Resource API methods
export const fetchDocuments = () => API.get('/documents');
export const createDocument = (data) => API.post('/documents', data);
export const deleteDocument = (id) => API.delete(`/documents/${id}`);

export const fetchTasks = () => API.get('/tasks');
export const createTask = (data) => API.post('/tasks', data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

export const fetchCases = () => API.get('/cases');
export const createCase = (data) => API.post('/cases', data);
export const deleteCase = (id) => API.delete(`/cases/${id}`);

export default API;
