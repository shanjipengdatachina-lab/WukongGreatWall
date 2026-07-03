import express, { Request, Response } from 'express';
import { TopicTask, Topic, User, Profile } from '../models';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = express.Router();

router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { topic_id, status, priority, assignee_id, page = 1, limit = 10 } = req.query;
    
    const where: any = {};
    if (topic_id) where.topic_id = topic_id;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignee_id) where.assignee_id = assignee_id;

    const { count, rows } = await TopicTask.findAndCountAll({
      where,
      include: [{ model: Topic }, { model: User, as: 'assignee', include: [{ model: Profile, as: 'profile' }] }],
      offset: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
      order: [['created_at', 'DESC']]
    });

    res.json({
      data: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const task = await TopicTask.create({
      ...req.body,
      created_by: req.user!.id
    });

    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const task = await TopicTask.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.update(req.body);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const task = await TopicTask.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
