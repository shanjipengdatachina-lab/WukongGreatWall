import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config';
import { sequelize } from './config/database';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import courseRoutes from './routes/courses';
import assignmentRoutes from './routes/assignments';
import submissionRoutes from './routes/submissions';
import topicRoutes from './routes/topics';
import taskRoutes from './routes/tasks';
import annotationRoutes from './routes/annotations';
import invitationRoutes from './routes/invitations';
import fileRoutes from './routes/files';
import dashboardRoutes from './routes/dashboard';
import studentRoutes from './routes/student';
import gameRoutes from './routes/game';
import tedRoutes from './routes/ted';
import scholarRoutes from './routes/scholar';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../', config.upload.dir)));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/annotations', annotationRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/student/game', gameRoutes);
app.use('/api/student/ted-profile', tedRoutes);
app.use('/api/scholar', scholarRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

export { app, sequelize };
