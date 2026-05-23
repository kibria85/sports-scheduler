import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email: string, password: string, firstName: string, lastName: string) =>
    api.post('/auth/register', { email, password, first_name: firstName, last_name: lastName }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
};

export const sportsAPI = {
  getAll: () => api.get('/sports'),
  getBySlug: (slug: string) => api.get(`/sports/${slug}`),
  create: (data: any) => api.post('/sports', data),
  update: (id: string, data: any) => api.put(`/sports/${id}`, data),
  delete: (id: string) => api.delete(`/sports/${id}`),
  getEvents: (sportId: string) => api.get(`/sports/${sportId}/events`),
};

export const eventsAPI = {
  get: (id: string) => api.get(`/events/${id}`),
  create: (data: any) => api.post('/events', data),
  createTeam: (eventId: string, data: any) => api.post(`/events/${eventId}/teams`, data),
  getTeams: (eventId: string) => api.get(`/events/${eventId}/teams`),
  createRole: (eventId: string, data: any) => api.post(`/events/${eventId}/roles`, data),
  getRoles: (eventId: string) => api.get(`/events/${eventId}/roles`),
  register: (eventId: string, data: any) => api.post(`/events/${eventId}/register`, data),
  getRegistration: (eventId: string) => api.get(`/events/${eventId}/registration`),
  getRegistrations: (eventId: string) => api.get(`/events/${eventId}/registrations`),
  assignPlayer: (eventId: string, data: any) => api.post(`/events/${eventId}/assign-player`, data),
};

export const paymentsAPI = {
  getPending: () => api.get('/payments/user/pending'),
  createIntent: (amount: number) => api.post('/payments/intent', { amount }),
  complete: (paymentId: string, stripePaymentId: string) =>
    api.post('/payments/complete', { payment_id: paymentId, stripe_payment_id: stripePaymentId }),
  addSponsor: (data: any) => api.post('/payments/sponsor', data),
  getEventSponsors: (eventId: string) => api.get(`/payments/event/${eventId}/sponsors`),
  completeSponsor: (sponsorId: string, stripePaymentId: string) =>
    api.post(`/payments/sponsor/${sponsorId}/complete`, { stripe_payment_id: stripePaymentId }),
};

export const usersAPI = {
  get: (id: string) => api.get(`/users/${id}`),
  getAll: () => api.get('/users'),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
};

export default api;
