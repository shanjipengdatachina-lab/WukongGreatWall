import express, { Request, Response } from 'express';
import { Submission, Annotation, User, Profile, Assignment, Institution } from '../models';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = express.Router();

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { assignment_id, user_id, status, page = 1, limit = 10 } = req.query;
    
    const where: any = {};
    if (assignment_id) where.assignment_id = assignment_id;
    if (user_id) where.user_id = user_id;
    if (status) where.status = status;

    if (req.user!.role !== 'admin' && !user_id) {
      where.user_id = req.user!.id;
    }

    const { count, rows } = await Submission.findAndCountAll({
      where,
      include: [{ model: User, include: [{ model: Profile, as: 'profile', include: [{ model: Institution, as: 'institution' }] }] }, { model: Assignment }],
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
    const submission = await Submission.findByPk(req.params.id, {
      include: [{ model: User, include: [{ model: Profile, as: 'profile' }] }, { model: Assignment }, { model: Annotation, as: 'annotations' }]
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { assignment_id, comment, version = 1, status = 'submitted' } = req.body;
    
    const existingSubmissions = await Submission.count({
      where: { assignment_id, user_id: req.user!.id }
    });

    const submission = await Submission.create({
      assignment_id,
      user_id: req.user!.id,
      version: existingSubmissions + 1,
      comment,
      status
    });

    res.status(201).json(submission);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const submission = await Submission.findByPk(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    if (req.user!.role !== 'admin' && submission.user_id !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await submission.update(req.body);
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
