import express, { Request, Response } from 'express';
import { Assignment, Course, Submission, User, Profile } from '../models';
import { authenticate, requireAdmin, AuthRequest } from '../middlewares/auth';

const router = express.Router();

router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { course_id, status, page = 1, limit = 10 } = req.query;
    
    const where: any = {};
    if (course_id) where.course_id = course_id;
    if (status) where.status = status;

    const { count, rows } = await Assignment.findAndCountAll({
      where,
      include: [{ model: Course }],
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
    const assignment = await Assignment.findByPk(req.params.id, {
      include: [{ model: Course }, { model: Submission, as: 'submissions', include: [{ model: User, include: [{ model: Profile, as: 'profile' }] }] }]
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const assignment = await Assignment.create({
      ...req.body,
      created_by: req.user!.id
    });

    res.status(201).json(assignment);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    await assignment.update(req.body);
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    await assignment.destroy();
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
