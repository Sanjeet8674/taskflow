import api from './client.js';

export async function register(payload) {
  const { data } = await api.post('/auth/register', payload);
  return data;
}

export async function login(payload) {
  const { data } = await api.post('/auth/login', payload);
  return data;
}

export async function refreshSession() {
  const { data } = await api.post('/auth/refresh');
  return data;
}

export async function logout() {
  await api.post('/auth/logout');
}

export async function fetchTasks(status) {
  const { data } = await api.get('/tasks', {
    params: status ? { status } : undefined,
  });
  return data.tasks;
}

export async function createTask(payload) {
  const { data } = await api.post('/tasks', payload);
  return data.task;
}

export async function updateTask(id, payload) {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data.task;
}

export async function completeTask(id) {
  const { data } = await api.patch(`/tasks/${id}/complete`);
  return data.task;
}

export async function deleteTask(id) {
  await api.delete(`/tasks/${id}`);
}
