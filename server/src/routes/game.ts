import express, { Request, Response } from 'express';
import { getGameOverview, checkin, getLeaderboard, getAchievements, getCalendarData } from '../services/game';
import { authenticate, AuthRequest } from '../middlewares/auth';
import { GameXP } from '../models/GameXP';

const router = express.Router();

router.get('/overview', authenticate, async (req: AuthRequest, res: Response) => {
  try { const data = await getGameOverview(req.user!.id); res.json(data); }
  catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

router.post('/checkin', authenticate, async (req: AuthRequest, res: Response) => {
  try { const data = await checkin(req.user!.id); res.json(data); }
  catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.get('/xp-log', authenticate, async (req: AuthRequest, res: Response) => {
  try { const { GameXPLog } = require('../models'); const logs = await GameXPLog.findAll({ where: { user_id: req.user!.id }, order: [['created_at', 'DESC']], limit: 50 }); res.json(logs); }
  catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

router.get('/achievements', authenticate, async (req: AuthRequest, res: Response) => {
  try { const data = await getAchievements(req.user!.id); res.json(data); }
  catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

router.get('/leaderboard', authenticate, async (req: Request, res: Response) => {
  try { const type = (req.query.type as string) || 'xp'; const data = await getLeaderboard(type); res.json(data); }
  catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

router.get('/calendar', authenticate, async (req: AuthRequest, res: Response) => {
  try { const data = await getCalendarData(req.user!.id); res.json(data); }
  catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
