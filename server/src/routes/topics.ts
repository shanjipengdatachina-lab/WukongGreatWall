import express, { Request, Response } from 'express';
import { Topic, TopicMember, TopicTask, User, Profile } from '../models';
import { authenticate, requireAdmin, AuthRequest } from '../middlewares/auth';

const router = express.Router();

router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const where: any = {};
    if (status) where.status = status;

    const { count, rows } = await Topic.findAndCountAll({
      where,
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

router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const topic = await Topic.findByPk(req.params.id, {
      include: [
        { model: TopicMember, as: 'members', include: [{ model: User, include: [{ model: Profile, as: 'profile' }] }] },
        { model: TopicTask, as: 'tasks' }
      ]
    });

    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const topic = await Topic.create({
      ...req.body,
      created_by: req.user!.id
    });

    res.status(201).json(topic);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const topic = await Topic.findByPk(req.params.id);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    await topic.update(req.body);
    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const topic = await Topic.findByPk(req.params.id);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    await topic.destroy();
    res.json({ message: 'Topic deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
