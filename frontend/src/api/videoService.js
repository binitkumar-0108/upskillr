import api from './axiosInstance';

export const videoService = {
  // GET /api/courses/:courseId/videos
  getByCourse: (courseId) =>
    api.get(`/courses/${courseId}/videos`).then((r) => r.data),

  // POST /api/courses/:courseId/videos — { title, youtubeUrl, description }
  add: (courseId, data) =>
    api.post(`/courses/${courseId}/videos`, data).then((r) => r.data),

  // GET /api/videos/:id
  getById: (id) => api.get(`/videos/${id}`).then((r) => r.data),

  // PUT /api/videos/:id — { title, description, order }
  update: (id, data) => api.put(`/videos/${id}`, data).then((r) => r.data),

  // DELETE /api/videos/:id
  remove: (id) => api.delete(`/videos/${id}`).then((r) => r.data),
};
