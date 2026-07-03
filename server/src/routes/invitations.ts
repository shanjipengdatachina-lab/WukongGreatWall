import express, { Request, Response } from 'express';
import { LabInvitation } from '../models';
import { authenticate, requireAdmin, AuthRequest } from '../middlewares/auth';

const router = express.Router();

router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const where: any = {};
    if (status) where.status = status;

    const { count, rows } = await LabInvitation.findAndCountAll({
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
    const invitation = await LabInvitation.findByPk(req.params.id);
    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    res.json(invitation);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const invitation = await LabInvitation.create(req.body);
    res.status(201).json(invitation);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const invitation = await LabInvitation.findByPk(req.params.id);
    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    await invitation.update(req.body);
    res.json(invitation);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const invitation = await LabInvitation.findByPk(req.params.id);
    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    await invitation.destroy();
    res.json({ message: 'Invitation deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
