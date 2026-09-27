import * as taskService from '../services/taskService.js';

export async function list(req, res, next) {
  try {
    const tasks = await taskService.listTasks(req.user.id, req.query.status);
    res.json({ tasks });
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const task = await taskService.getTask(req.user.id, req.params.id);
    res.json({ task });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const task = await taskService.createTask(req.user.id, req.body);
    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const task = await taskService.updateTask(
      req.user.id,
      req.params.id,
      req.body,
    );
    res.json({ task });
  } catch (error) {
    next(error);
  }
}

export async function complete(req, res, next) {
  try {
    const task = await taskService.completeTask(req.user.id, req.params.id);
    res.json({ task });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await taskService.deleteTask(req.user.id, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
