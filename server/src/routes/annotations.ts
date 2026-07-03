import express, { Request, Response } from 'express';
import { Annotation, Submission, User, Profile } from '../models';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = express.Router();

router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { submission_id, page = 1, limit = 10 } = req.query;
    
    const where: any = {};
    if (submission_id) where.submission_id = submission_id;

    const { count, rows } = await Annotation.findAndCountAll({
      where,
      include: [{ model: User, include: [{ model: Profile, as: 'profile' }] }, { model: Submission }],
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
    const annotation = await Annotation.create({
      ...req.body,
      user_id: req.user!.id
    });

    res.status(201).json(annotation);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const annotation = await Annotation.findByPk(req.params.id);
    if (!annotation) {
      return res.status(404).json({ error: 'Annotation not found' });
    }

    if (req.user!.role !== 'admin' && annotation.user_id !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await annotation.update(req.body);
    res.json(annotation);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const annotation = await Annotation.findByPk(req.params.id);
    if (!annotation) {
      return res.status(404).json({ error: 'Annotation not found' });
    }

    if (req.user!.role !== 'admin' && annotation.user_id !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await annotation.destroy();
    res.json({ message: 'Annotation deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
