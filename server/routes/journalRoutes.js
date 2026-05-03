import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import fs from 'fs';
import pool from '../config/postgres.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

const processJournalImage = async (buffer, filename) => {
  const uploadsDir = path.join(__dirname, '../uploads/journals');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const outputFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
  const outputPath = path.join(uploadsDir, outputFilename);

  await sharp(buffer)
    .resize(1080, 1080, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 85, progressive: true, mozjpeg: true })
    .toFile(outputPath);

  return outputFilename;
};

router.post('/upload-images', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const processedImages = await Promise.all(
      req.files.map(async (file) => {
        const filename = await processJournalImage(file.buffer, file.originalname);
        return `/uploads/journals/${filename}`;
      })
    );

    res.json({
      success: true,
      images: processedImages,
      count: processedImages.length,
      message: `${processedImages.length} image(s) uploaded successfully`
    });
  } catch (error) {
    console.error('Error uploading journal images:', error);
    res.status(500).json({ success: false, message: 'Failed to upload images' });
  }
});

router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { title, destination, tripDate, notes, images, isPublic } = req.body;

    if (!title || !destination || !tripDate || !notes || !images || images.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const result = await pool.query(
      'INSERT INTO journals (user_id, title, destination, trip_date, notes, images, is_public) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.id, title.trim(), destination.trim(), new Date(tripDate), notes.trim(), JSON.stringify(images), isPublic || false]
    );

    res.status(201).json({
      success: true,
      journal: result.rows[0],
      message: 'Journal created successfully!'
    });
  } catch (error) {
    console.error('Error creating journal:', error);
    res.status(500).json({ success: false, message: 'Failed to create journal' });
  }
});

router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    if (req.params.userId !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const result = await pool.query(
      'SELECT * FROM journals WHERE user_id = $1 ORDER BY created_at DESC',
      [req.params.userId]
    );

    res.json({
      success: true,
      journals: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    console.error('Error fetching user journals:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch journals' });
  }
});

router.get('/public', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM journals WHERE is_public = true ORDER BY created_at DESC LIMIT 50'
    );

    res.json({
      success: true,
      journals: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    console.error('Error fetching public journals:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch public journals' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM journals WHERE id = $1',
      [req.params.id]
    );

    const journal = result.rows[0];
    if (!journal) {
      return res.status(404).json({ success: false, message: 'Journal not found' });
    }

    if (!journal.is_public && journal.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'This journal is private' });
    }

    res.json({ success: true, journal });
  } catch (error) {
    console.error('Error fetching journal:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch journal' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, destination, tripDate, notes, images, isPublic } = req.body;

    const result = await pool.query(
      'UPDATE journals SET title = COALESCE($1, title), destination = COALESCE($2, destination), ' +
      'trip_date = COALESCE($3, trip_date), notes = COALESCE($4, notes), images = COALESCE($5, images), ' +
      'is_public = COALESCE($6, is_public), updated_at = CURRENT_TIMESTAMP ' +
      'WHERE id = $7 AND user_id = $8 RETURNING *',
      [title, destination, tripDate ? new Date(tripDate) : null, notes, images ? JSON.stringify(images) : null, isPublic, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Journal not found or unauthorized' });
    }

    res.json({ success: true, journal: result.rows[0], message: 'Journal updated successfully!' });
  } catch (error) {
    console.error('Error updating journal:', error);
    res.status(500).json({ success: false, message: 'Failed to update journal' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM journals WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Journal not found or unauthorized' });
    }

    res.json({ success: true, message: 'Journal deleted successfully!' });
  } catch (error) {
    console.error('Error deleting journal:', error);
    res.status(500).json({ success: false, message: 'Failed to delete journal' });
  }
});

export default router;
