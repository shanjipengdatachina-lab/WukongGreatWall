import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { File } from '../models';
import { authenticate, AuthRequest } from '../middlewares/auth';
import { config } from '../config';

const router = express.Router();

const uploadDir = path.join(__dirname, '../../', config.upload.dir);

router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { file_type, page = 1, limit = 20 } = req.query;
    const where: any = {};
    if (file_type) where.file_type = file_type;

    const { count, rows } = await File.findAndCountAll({
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

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = (req.query.type as string) || 'other';
    const typeDir = path.join(uploadDir, type);
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }
    cb(null, typeDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    cb(null, `${timestamp}_${random}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxSize },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  }
});

router.post('/upload', authenticate, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const type = (req.query.type as string) || 'other';
    const referenceId = req.query.reference_id ? Number(req.query.reference_id) : undefined;

    const fileRecord = await File.create({
      name: req.file.filename,
      original_name: req.file.originalname,
      path: `/uploads/${type}/${req.file.filename}`,
      size: req.file.size,
      mime_type: req.file.mimetype,
      file_type: type as any,
      reference_id: referenceId,
      uploaded_by: req.user!.id,
      storage_type: 'local'
    });

    res.json({
      id: fileRecord.id,
      name: fileRecord.name,
      original_name: fileRecord.original_name,
      path: fileRecord.path,
      url: `http://localhost:${config.port}${fileRecord.path}`
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json(file);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (req.user!.role !== 'admin' && file.uploaded_by !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const filePath = path.join(uploadDir, file.path.replace('/uploads/', ''));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await file.destroy();
    res.json({ message: 'File deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
