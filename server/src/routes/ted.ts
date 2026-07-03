import express, { Request, Response } from 'express';
import { TEDProfile, User, Profile, Institution } from '../models';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = express.Router();

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    let ted = await TEDProfile.findOne({ where: { user_id: req.user!.id } });
    if (!ted) {
      const profile = await Profile.findOne({ where: { user_id: req.user!.id }, include: [{ model: Institution, as: 'institution' }] });
      ted = await TEDProfile.create({
        user_id: req.user!.id,
        display_name: profile?.real_name || req.user!.username,
        location: (profile as any)?.institution?.city || '',
        visible_fields: JSON.stringify(['display_name','title','institution','avatar','research_fields','bio_full','education','achievements','featured_works']),
        status: 'draft'
      });
    }
    const profile = await Profile.findOne({ where: { user_id: req.user!.id }, include: [{ model: Institution, as: 'institution' }] });
    const user = await User.findByPk(req.user!.id);
    res.json({
      ...ted.toJSON(),
      scholar_id: user?.scholar_id,
      avatar: (profile as any)?.avatar,
      institution: (profile as any)?.institution?.name,
      research_fields_raw: (profile as any)?.research_direction,
      bio: (profile as any)?.bio
    });
  } catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

router.put('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    let ted = await TEDProfile.findOne({ where: { user_id: req.user!.id } });
    const data = { ...req.body };
    delete data.id; delete data.user_id; delete data.scholar_id; delete data.created_at; delete data.updated_at;
    if (ted) { await ted.update(data); } else { ted = await TEDProfile.create({ ...data, user_id: req.user!.id }); }
    res.json(ted);
  } catch (error: any) { res.status(500).json({ error: error.message }); }
});

router.post('/publish', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    let ted = await TEDProfile.findOne({ where: { user_id: req.user!.id } });
    if (!ted) return res.status(404).json({ error: 'TED profile not found' });
    await ted.update({ status: 'published', published_at: new Date() });
    res.json(ted);
  } catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
