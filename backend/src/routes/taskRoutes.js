import { Router } from 'express';
import * as taskController from '../controllers/taskController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createTaskSchema,
  listTasksSchema,
  taskIdSchema,
  updateTaskSchema,
} from '../validators/schemas.js';

const router = Router();

router.use(requireAuth);

router.get('/', validate(listTasksSchema), taskController.list);
router.get('/:id', validate(taskIdSchema), taskController.getById);
router.post('/', validate(createTaskSchema), taskController.create);
router.put('/:id', validate(updateTaskSchema), taskController.update);
router.patch('/:id/complete', validate(taskIdSchema), taskController.complete);
router.delete('/:id', validate(taskIdSchema), taskController.remove);

export default router;
