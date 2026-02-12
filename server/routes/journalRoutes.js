import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import fs from 'fs';
import Journal from '../models/Journal.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for journal image uploads
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
    fileSize: 5 * 1024 * 1024 // 5MB per file
  }
});

// Process and compress journal image
const processJournalImage = async (buffer, filename) => {
  const uploadsDir = path.join(__dirname, '../uploads/journals');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const outputFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
  const outputPath = path.join(uploadsDir, outputFilename);

  // Process image: resize to 1080x1080 and compress
  await sharp(buffer)
    .resize(1080, 1080, {
      fit: 'cover',
      position: 'center'
    })
    .jpeg({
      quality: 85,
      progressive: true,
      mozjpeg: true
    })
    .toFile(outputPath);

  return outputFilename;
};

// Upload journal images (up to 10)
router.post('/upload-images', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    // Process all images
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

// Create new journal entry
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { title, destination, tripDate, notes, images, isPublic } = req.body;

    // Validation
    if (!title || !destination || !tripDate || !notes) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, destination, trip date, and notes are required' 
      });
    }

    if (!images || images.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one image is required' 
      });
    }

    if (images.length > 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Maximum 10 images allowed' 
      });
    }

    const journal = new Journal({
      userId: req.user.id,
      title: title.trim(),
      destination: destination.trim(),
      tripDate: new Date(tripDate),
      notes: notes.trim(),
      images,
      isPublic: isPublic || false
    });

    await journal.save();

    res.status(201).json({
      success: true,
      journal,
      message: 'Journal created successfully!'
    });
  } catch (error) {
    console.error('Error creating journal:', error);
    res.status(500).json({ success: false, message: 'Failed to create journal' });
  }
});

// Get all journals for logged-in user
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    // Ensure user can only access their own journals
    if (req.params.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const journals = await Journal.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      journals,
      count: journals.length
    });
  } catch (error) {
    console.error('Error fetching user journals:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch journals' });
  }
});

// Get all public journals
router.get('/public', async (req, res) => {
  try {
    const journals = await Journal.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({
      success: true,
      journals,
      count: journals.length
    });
  } catch (error) {
    console.error('Error fetching public journals:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch public journals' });
  }
});

// Get single journal by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({ success: false, message: 'Journal not found' });
    }

    // Check privacy - only owner can view private journals
    if (!journal.isPublic && journal.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'This journal is private' });
    }

    res.json({
      success: true,
      journal
    });
  } catch (error) {
    console.error('Error fetching journal:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch journal' });
  }
});

// Update journal
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, destination, tripDate, notes, images, isPublic } = req.body;

    const journal = await Journal.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!journal) {
      return res.status(404).json({ 
        success: false, 
        message: 'Journal not found or unauthorized' 
      });
    }

    // Update fields
    if (title !== undefined) journal.title = title.trim();
    if (destination !== undefined) journal.destination = destination.trim();
    if (tripDate !== undefined) journal.tripDate = new Date(tripDate);
    if (notes !== undefined) journal.notes = notes.trim();
    if (images !== undefined) {
      if (images.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'At least one image is required' 
        });
      }
      if (images.length > 10) {
        return res.status(400).json({ 
          success: false, 
          message: 'Maximum 10 images allowed' 
        });
      }
      journal.images = images;
    }
    if (isPublic !== undefined) journal.isPublic = isPublic;

    journal.updatedAt = new Date();
    await journal.save();

    res.json({
      success: true,
      journal,
      message: 'Journal updated successfully!'
    });
  } catch (error) {
    console.error('Error updating journal:', error);
    res.status(500).json({ success: false, message: 'Failed to update journal' });
  }
});

// Delete journal
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const journal = await Journal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!journal) {
      return res.status(404).json({ 
        success: false, 
        message: 'Journal not found or unauthorized' 
      });
    }

    // Optionally delete associated images from filesystem
    // (Uncomment if you want to clean up files)
    /*
    journal.images.forEach(imageUrl => {
      const filename = path.basename(imageUrl);
      const filePath = path.join(__dirname, '../uploads/journals', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    */

    res.json({
      success: true,
      message: 'Journal deleted successfully!'
    });
  } catch (error) {
    console.error('Error deleting journal:', error);
    res.status(500).json({ success: false, message: 'Failed to delete journal' });
  }
});

export default router;
