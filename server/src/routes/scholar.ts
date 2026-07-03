import express, { Request, Response } from 'express';
import { TEDProfile, User, Profile, Institution } from '../models';

const router = express.Router();

router.get('/:scholarId', async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ where: { scholar_id: req.params.scholarId }, include: [{ model: Profile, as: 'profile', include: [{ model: Institution, as: 'institution' }] }] }) as any;
    if (!user) return res.status(404).json({ error: 'Scholar not found' });

    const ted = await TEDProfile.findOne({ where: { user_id: user.id } });
    if (!ted || ted.status !== 'published') return res.status(404).json({ error: 'TED profile not published' });

    const profile = user.profile;
    let visibleFields: string[] = [];
    try { visibleFields = JSON.parse(ted.visible_fields || '[]'); } catch {}

    const data: any = {};
    if (visibleFields.includes('display_name')) data.display_name = ted.display_name;
    if (visibleFields.includes('title')) data.title = ted.title;
    if (visibleFields.includes('institution')) data.institution = profile?.institution?.name;
    if (visibleFields.includes('avatar')) data.avatar = ted.cover_image ? null : profile?.avatar;
    if (visibleFields.includes('cover_image')) data.cover_image = ted.cover_image;
    if (visibleFields.includes('location')) data.location = ted.location;
    if (visibleFields.includes('research_fields')) { try { data.research_fields = JSON.parse(ted.research_fields || '[]'); } catch {} }
    if (visibleFields.includes('keywords')) { try { data.keywords = JSON.parse(ted.keywords || '[]'); } catch {} }
    if (visibleFields.includes('bio_full')) data.bio_full = ted.bio_full;
    if (visibleFields.includes('education')) { try { data.education = JSON.parse(ted.education || '[]'); } catch {} }
    if (visibleFields.includes('achievements')) { try { data.achievements = JSON.parse(ted.achievements || '[]'); } catch {} }
    if (visibleFields.includes('featured_works')) { try { data.featured_works = JSON.parse(ted.featured_works || '[]'); } catch {} }
    if (visibleFields.includes('social_links')) { try { data.social_links = JSON.parse(ted.social_links || '[]'); } catch {} }
    if (visibleFields.includes('course_progress')) { try { data.course_progress = JSON.parse(ted.course_progress || '[]'); } catch {} }

    data.scholar_id = user.scholar_id;
    if (visibleFields.includes('avatar')) data.avatar = profile?.avatar;

    res.json(data);
  } catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
