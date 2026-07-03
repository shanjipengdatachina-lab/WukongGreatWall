import express, { Response } from 'express';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = express.Router();

router.get('/courses', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { Course } = require('../models');
    const courses = await Course.findAll({ where: { status: 'published' } });
    res.json(courses);
  } catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

router.get('/courses/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { Course, CourseChapter } = require('../models');
    const course = await Course.findByPk(req.params.id, { include: [{ model: CourseChapter, as: 'chapters' }] });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

router.get('/assignments', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { Assignment, Course } = require('../models');
    const assignments = await Assignment.findAll({ where: { status: 'published' }, include: [{ model: Course }] });
    res.json(assignments);
  } catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

router.get('/assignments/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { Assignment, Course } = require('../models');
    const assignment = await Assignment.findByPk(req.params.id, { include: [{ model: Course }] });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    res.json(assignment);
  } catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

router.get('/submissions', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { Submission, Assignment } = require('../models');
    const submissions = await Submission.findAll({
      where: { user_id: req.user!.id },
      include: [{ model: Assignment }],
      order: [['created_at', 'DESC']]
    });
    res.json(submissions);
  } catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

router.get('/topics', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { TopicMember, Topic } = require('../models');
    const memberships = await TopicMember.findAll({ where: { user_id: req.user!.id }, include: [{ model: Topic }] });
    res.json(memberships);
  } catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

router.get('/topics/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { Topic, TopicMember, TopicTask, User, Profile } = require('../models');
    const topic = await Topic.findByPk(req.params.id, {
      include: [
        { model: TopicMember, as: 'members', include: [{ model: User, include: [{ model: Profile, as: 'profile' }] }] },
        { model: TopicTask, as: 'tasks' }
      ]
    });
    if (!topic) return res.status(404).json({ error: 'Topic not found' });
    res.json(topic);
  } catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

router.get('/tasks', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { TopicTask, Topic } = require('../models');
    const tasks = await TopicTask.findAll({ where: { assignee_id: req.user!.id }, include: [{ model: Topic }] });
    res.json(tasks);
  } catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

router.put('/tasks/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { TopicTask } = require('../models');
    const task = await TopicTask.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await task.update(req.body);
    res.json(task);
  } catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

export default router;
