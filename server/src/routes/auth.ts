import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User, Profile } from '../models';
import { config } from '../config';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const options: SignOptions = { expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'] };
    const token = jwt.sign({ id: user.id }, config.jwt.secret as string, options);

    const profile = user.profile_id ? await Profile.findByPk(user.profile_id) : null;

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        scholar_id: user.scholar_id,
        profile: profile ? {
          id: profile.id,
          real_name: profile.real_name,
          student_id: profile.student_id,
          avatar: profile.avatar
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByPk(req.user!.id, { include: [{ model: Profile, as: 'profile' }] });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profileData = (user as any).profile;

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      scholar_id: user.scholar_id,
      profile: profileData
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
