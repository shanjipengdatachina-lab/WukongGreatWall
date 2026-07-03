import express, { Request, Response } from 'express';
import { Course, CourseChapter, Institution } from '../models';
import { authenticate, requireAdmin, AuthRequest } from '../middlewares/auth';

const router = express.Router();

router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const where: any = {};
    if (status) where.status = status;

    const { count, rows } = await Course.findAndCountAll({
      where,
      include: [{ model: CourseChapter, as: 'chapters' }],
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

router.post('/:courseId/chapters', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const chapter = await CourseChapter.create({
      course_id: Number(req.params.courseId),
      order: req.body.order || 0,
      ...req.body
    });
    res.status(201).json(chapter);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.put('/:courseId/chapters/:chapterId', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const chapter = await CourseChapter.findByPk(req.params.chapterId);
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
    await chapter.update(req.body);
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:courseId/chapters/:chapterId', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const chapter = await CourseChapter.findByPk(req.params.chapterId);
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
    await chapter.destroy();
    res.json({ message: 'Chapter deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [{ model: CourseChapter, as: 'chapters' }]
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.create({
      ...req.body,
      created_by: req.user!.id
    });

    res.status(201).json(course);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await course.update(req.body);
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await course.destroy();
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
