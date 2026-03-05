import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  // Only access localStorage in browser
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('qh_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {

    if (
      typeof window !== 'undefined' &&
      error.response?.status === 401 &&
      !window.location.pathname.includes('/login')
    ) {
      console.warn("Token expired → logout");

      localStorage.removeItem('qh_token');
      localStorage.removeItem('qh_user');

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  logout:   ()     => api.post('/auth/logout'),
  me:       ()     => api.get('/auth/me'),
};

export const categoriesApi = {
  getAll:  ()           => api.get('/categories'),
  create:  (data)       => api.post('/categories', data),
  update:  (id, data)   => api.put(`/categories/${id}`, data),
  delete:  (id)         => api.delete(`/categories/${id}`),
};

export const jobsApi = {
  getAll:     (params = {}) => api.get('/jobs', { params }),
  getOne:     (id)          => api.get(`/jobs/${id}`),
  create:     (data)        => api.post('/jobs', data),
  update:     (id, data)    => api.put(`/jobs/${id}`, data),
  delete:     (id)          => api.delete(`/jobs/${id}`),
  getFilters: ()            => api.get('/jobs/meta/filters'),
};

export const applicationsApi = {
  submit:       (data)       => api.post('/applications', data),
  getAll:       ()           => api.get('/applications'),
  getMine:      ()           => api.get('/my-applications'),
  updateStatus: (id, status) => api.put(`/applications/${id}`, { status }),
};

export default api;