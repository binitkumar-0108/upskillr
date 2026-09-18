import api from './axiosInstance';

export const courseService = {
  // GET /api/courses — all published courses
  getAll: () => api.get('/courses').then((r) => r.data),

  // GET /api/courses/:id
  getById: (id) => api.get(`/courses/${id}`).then((r) => r.data),

  // POST /api/courses — { title, description, category }
  create: (data) => api.post('/courses', data).then((r) => r.data),

  // DELETE /api/courses/:id
  remove: (id) => api.delete(`/courses/${id}`).then((r) => r.data),
};
