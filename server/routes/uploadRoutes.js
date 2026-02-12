import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import fs from 'fs';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer to store files in memory for processing
const storage = multer.memoryStorage();

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit per file (will be compressed)
  }
});

// Helper function to process and compress image
const processImage = async (buffer, filename) => {
  const uploadsDir = path.join(__dirname, '../uploads/posts');
  
  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const outputFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
  const outputPath = path.join(uploadsDir, outputFilename);

  // Process image: resize to Instagram 1:1 ratio (1080x1080) and compress
  await sharp(buffer)
    .resize(1080, 1080, {
      fit: 'cover', // Crop to fill the square
      position: 'center' // Center the crop
    })
    .jpeg({
      quality: 85, // Good quality, smaller size
      progressive: true,
      mozjpeg: true // Use mozjpeg for better compression
    })
    .toFile(outputPath);

  return outputFilename;
};

// Upload single image
router.post('/image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Process and compress the image
    const filename = await processImage(req.file.buffer, req.file.originalname);
    const imageUrl = `/uploads/posts/${filename}`;

    // Get file size after compression
    const filePath = path.join(__dirname, '../uploads/posts', filename);
    const stats = fs.statSync(filePath);

    res.json({
      success: true,
      url: imageUrl,
      filename: filename,
      originalSize: req.file.size,
      compressedSize: stats.size,
      message: 'Image uploaded and compressed successfully'
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
});

// Upload multiple images (up to 6)
router.post('/images', authenticateToken, upload.array('images', 6), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    // Process all images
    const processedImages = await Promise.all(
      req.files.map(async (file) => {
        const filename = await processImage(file.buffer, file.originalname);
        const filePath = path.join(__dirname, '../uploads/posts', filename);
        const stats = fs.statSync(filePath);
        
        return {
          url: `/uploads/posts/${filename}`,
          filename: filename,
          originalSize: file.size,
          compressedSize: stats.size
        };
      })
    );

    const totalOriginalSize = req.files.reduce((sum, file) => sum + file.size, 0);
    const totalCompressedSize = processedImages.reduce((sum, img) => sum + img.compressedSize, 0);
    const compressionRatio = ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1);

    res.json({
      success: true,
      images: processedImages,
      count: processedImages.length,
      totalOriginalSize,
      totalCompressedSize,
      compressionRatio: `${compressionRatio}%`,
      message: `${processedImages.length} image(s) uploaded and compressed (saved ${compressionRatio}%)`
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ success: false, message: 'Failed to upload images' });
  }
});

// Error handling middleware for multer errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File size exceeds 5MB limit' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ success: false, message: 'Too many files. Maximum 6 images allowed' });
    }
    return res.status(400).json({ success: false, message: error.message });
  }
  
  if (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
  
  next();
});

export default router;
