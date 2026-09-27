import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDatabase, sequelize } from '../src/config/database.js';
import '../src/models/index.js';

const app = createApp();

const uniqueEmail = `user_${Date.now()}@example.com`;

describe('auth and tasks API', () => {
  beforeAll(async () => {
    await connectDatabase();
  }, 30000);

  afterAll(async () => {
    await sequelize.close();
  });

  it('registers, creates, updates, completes, and deletes a task', async () => {
    const agent = request.agent(app);

    const registerRes = await agent.post('/api/auth/register').send({
      name: 'Test User',
      email: uniqueEmail,
      password: 'password123',
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.accessToken).toBeTruthy();

    const token = registerRes.body.accessToken;

    const createRes = await agent
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Write tests',
        description: 'Cover auth and CRUD',
        status: 'pending',
        dueDate: '2099-06-01',
      });

    expect(createRes.status).toBe(201);
    const taskId = createRes.body.task.id;

    const listRes = await agent
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(listRes.status).toBe(200);
    expect(listRes.body.tasks.some((t) => t.id === taskId)).toBe(true);

    const updateRes = await agent
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'in_progress' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.task.status).toBe('in_progress');

    const completeRes = await agent
      .patch(`/api/tasks/${taskId}/complete`)
      .set('Authorization', `Bearer ${token}`);
    expect(completeRes.status).toBe(200);
    expect(completeRes.body.task.status).toBe('completed');

    const deleteRes = await agent
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteRes.status).toBe(204);
  });

  it('rejects invalid login', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@example.com',
      password: 'wrong-password',
    });
    expect(res.status).toBe(401);
  });
});
