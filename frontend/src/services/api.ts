import axios from 'axios';

// Support Vite (`import.meta.env.VITE_API_URL`) and CRA-style `process.env.REACT_APP_API_URL`
const API_BASE_URL = ((import.meta as any)?.env?.VITE_API_URL as string) || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
  createAdmin: (email: string, password: string) =>
    api.post('/auth/create-admin', { email, password }),
};

export const profileApi = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data: any) => api.put('/profile', data),
  getBasicPreferences: () => api.get('/profile/preferences/basic'),
  updateBasicPreferences: (data: any) => api.put('/profile/preferences/basic', data),
  getLifestylePreferences: () => api.get('/profile/preferences/lifestyle'),
  updateLifestylePreferences: (data: any) => api.put('/profile/preferences/lifestyle', data),
};

export const matchesApi = {
  searchMatches: (limit?: number) =>
    api.get('/matches/search', { params: { limit } }),
  getMatches: () => api.get('/matches'),
  getMatchRequests: () => api.get('/matches/requests'),
  sendMatchRequest: (receiverId: string, message?: string) =>
    api.post('/matches/request', { receiver_id: receiverId, message }),
  updateMatchRequest: (requestId: string, status: string) =>
    api.put(`/matches/request/${requestId}`, { status }),
};

export const chatApi = {
  getMessages: (matchId: string) => api.get(`/chat/${matchId}`),
  sendMessage: (matchId: string, content: string) =>
    api.post(`/chat/${matchId}`, { content }),
  markAsRead: (messageId: string) =>
    api.put(`/chat/message/${messageId}/read`),
};

export const notificationsApi = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (notificationId: string) =>
    api.put(`/notifications/${notificationId}/read`),
};

export const adminApi = {
  getReports: (status?: string) => 
    api.get('/admin/reports', { params: status ? { status } : {} }),
  updateReport: (reportId: string, status: string, admin_notes?: string) =>
    api.put(`/admin/reports/${reportId}`, { status, admin_notes }),
  getUsers: () => api.get('/admin/users'),
  updateUserStatus: (userId: string, status: string) =>
    api.put(`/admin/users/${userId}/status`, { status }),
  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),
  getStats: () => api.get('/admin/stats'),
};

export const blockApi = {
  blockUser: (userId: string) => api.post(`/profile/block/${userId}`),
  unblockUser: (userId: string) => api.delete(`/profile/block/${userId}`),
  reportUser: (reportedId: string, reason: string) =>
    api.post('/profile/report', { reported_id: reportedId, reason }),
};

export default api;
