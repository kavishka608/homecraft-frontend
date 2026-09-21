import api from './api';

export const projectService = {
  getAll: () => api.get('/projects'),
  getMyProjects: () => api.get('/projects/my-projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  complete: (id) => api.put(`/projects/${id}/complete`),
  delete: (id) => api.delete(`/projects/${id}`),
  search: (filters) => api.post('/projects/search', filters),
};