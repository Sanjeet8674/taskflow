import { Task } from '../models/index.js';
import { AppError } from '../utils/AppError.js';

function serializeTask(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

export async function listTasks(userId, status) {
  const where = { userId };
  if (status) {
    where.status = status;
  }

  const tasks = await Task.findAll({
    where,
    order: [
      ['dueDate', 'ASC'],
      ['createdAt', 'DESC'],
    ],
  });

  return tasks.map(serializeTask);
}

export async function getTask(userId, taskId) {
  const task = await Task.findOne({ where: { id: taskId, userId } });
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  return serializeTask(task);
}

export async function createTask(userId, data) {
  const task = await Task.create({
    userId,
    title: data.title,
    description: data.description ?? '',
    status: data.status ?? 'pending',
    dueDate: data.dueDate,
  });
  return serializeTask(task);
}

export async function updateTask(userId, taskId, data) {
  const task = await Task.findOne({ where: { id: taskId, userId } });
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (data.title !== undefined) task.title = data.title;
  if (data.description !== undefined) task.description = data.description;
  if (data.status !== undefined) task.status = data.status;
  if (data.dueDate !== undefined) task.dueDate = data.dueDate;

  await task.save();
  return serializeTask(task);
}

export async function completeTask(userId, taskId) {
  return updateTask(userId, taskId, { status: 'completed' });
}

export async function deleteTask(userId, taskId) {
  const deleted = await Task.destroy({ where: { id: taskId, userId } });
  if (!deleted) {
    throw new AppError('Task not found', 404);
  }
}
