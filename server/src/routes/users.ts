import express, { Request, Response } from 'express';
import { User, Profile, Institution } from '../models';
import { authenticate, requireAdmin, AuthRequest } from '../middlewares/auth';

const router = express.Router();

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { role, status, page = 1, limit = 10 } = req.query;
    
    const where: any = {};
    if (role) where.role = role;
    if (status) where.status = status;

    const { count, rows } = await User.findAndCountAll({
      where,
      include: [{ model: Profile, as: 'profile', include: [{ model: Institution, as: 'institution' }] }],
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
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Profile, as: 'profile', include: [{ model: Institution, as: 'institution' }] }]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { username, email, password, role = 'student', profile } = req.body;
    
    const hashedPassword = await require('bcryptjs').hash(password, 10);
    
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      status: 'active'
    });

    if (profile) {
      const createdProfile = await Profile.create({
        user_id: user.id,
        ...profile
      });
      await user.update({ profile_id: createdProfile.id });
    }

    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin' && Number(req.params.id) !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { email, role, status, real_name, student_id, institution_name, phone, research_direction } = req.body;
    await user.update({ email, role, status });

    if (user.profile_id) {
      const profile = await Profile.findByPk(user.profile_id);
      if (profile) {
        const updates: any = {};
        if (real_name !== undefined) updates.real_name = real_name;
        if (student_id !== undefined) updates.student_id = student_id;
        if (phone !== undefined) updates.phone = phone;
        if (research_direction !== undefined) updates.research_direction = research_direction;
        if (Object.keys(updates).length > 0) {
          await profile.update(updates);
        }
      }
    }

    const updatedUser = await User.findByPk(req.params.id, {
      include: [{ model: Profile, as: 'profile', include: [{ model: Institution, as: 'institution' }] }]
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/reset-password', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newPassword = req.body.password || 'student@123';
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.json({ message: 'Password reset successfully', password: newPassword });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
