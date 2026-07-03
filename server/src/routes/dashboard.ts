import express, { Request, Response } from 'express';
import { User, Profile, Institution, Course, Assignment, Submission, Topic } from '../models';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = express.Router();

router.get('/overview', authenticate, async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.count({ where: { role: 'student' } });
    const activeUsers = await User.count({ where: { role: 'student', status: 'active' } });
    const totalCourses = await Course.count();
    const publishedCourses = await Course.count({ where: { status: 'published' } });
    const totalAssignments = await Assignment.count();
    const totalSubmissions = await Submission.count();
    const submittedSubmissions = await Submission.count({ where: { status: 'submitted' } });
    const reviewedSubmissions = await Submission.count({ where: { status: 'reviewed' } });
    const totalTopics = await Topic.count();
    const activeTopics = await Topic.count({ where: { status: 'active' } });

    res.json({
      totalUsers,
      activeUsers,
      totalCourses,
      publishedCourses,
      totalAssignments,
      totalSubmissions,
      submittedSubmissions,
      reviewedSubmissions,
      totalTopics,
      activeTopics
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/recent-submissions', authenticate, async (req: Request, res: Response) => {
  try {
    const submissions = await Submission.findAll({
      include: [
        { model: Assignment },
        { model: User, include: [{ model: Profile, as: 'profile' }] }
      ],
      order: [['created_at', 'DESC']],
      limit: 10
    });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
