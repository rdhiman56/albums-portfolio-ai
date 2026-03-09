const express = require('express');
const router = express.Router();
const { Photo } = require('../models');
const { upload, uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

// GET /api/photos - public
router.get('/', async (req, res) => {
  const { album, featured } = req.query;
  const filter = {};
  if (album) filter.album = album;
  if (featured === 'true') filter.featured = true;
  const photos = await Photo.find(filter).populate('album', 'title type').sort({ order: 1, createdAt: -1 });
  res.json(photos);
});

// POST /api/photos - admin only
router.post('/', protect, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

  const result = await uploadToCloudinary(req.file.buffer, 'portfolio/photos');
  const photo = await Photo.create({
    title: req.body.title || 'Untitled',
    description: req.body.description || '',
    album: req.body.album || null,
    imageUrl: result.secure_url,
    publicId: result.public_id,
    featured: req.body.featured === 'true',
    order: parseInt(req.body.order) || 0
  });
  res.status(201).json(photo);
});

// PUT /api/photos/:id - admin only
router.put('/:id', protect, async (req, res) => {
  const photo = await Photo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!photo) return res.status(404).json({ message: 'Photo not found' });
  res.json(photo);
});

// DELETE /api/photos/:id - admin only
router.delete('/:id', protect, async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  if (!photo) return res.status(404).json({ message: 'Photo not found' });
  await deleteFromCloudinary(photo.publicId);
  await photo.deleteOne();
  res.json({ message: 'Photo deleted' });
});

module.exports = router;
