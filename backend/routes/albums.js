const express = require('express');
const router = express.Router();
const { Album, Photo } = require('../models');
const { upload, uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

// GET /api/albums - public (all albums with photo count)
router.get('/', async (req, res) => {
  const { type } = req.query;
  const filter = {};
  if (type && type !== 'All') filter.type = type;
  const albums = await Album.find(filter).sort({ order: 1, date: -1, createdAt: -1 });

  // Add photo count to each album
  const albumsWithCount = await Promise.all(albums.map(async (album) => {
    const count = await Photo.countDocuments({ album: album._id });
    return { ...album.toObject(), photoCount: count };
  }));

  res.json(albumsWithCount);
});

// GET /api/albums/:id - public (single album with photos)
router.get('/:id', async (req, res) => {
  const album = await Album.findById(req.params.id);
  if (!album) return res.status(404).json({ message: 'Album not found' });
  const photos = await Photo.find({ album: req.params.id }).sort({ order: 1, createdAt: -1 });
  res.json({ ...album.toObject(), photos });
});

// POST /api/albums - admin only
router.post('/', protect, upload.single('cover'), async (req, res) => {
  let coverImage = '';
  let coverPublicId = '';

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/covers');
    coverImage = result.secure_url;
    coverPublicId = result.public_id;
  }

  const album = await Album.create({
    title: req.body.title,
    description: req.body.description || '',
    type: req.body.type || 'Trip',
    location: req.body.location || '',
    date: req.body.date || '',
    coverImage,
    coverPublicId,
    featured: req.body.featured === 'true',
    order: parseInt(req.body.order) || 0
  });

  res.status(201).json(album);
});

// PUT /api/albums/:id - admin only
router.put('/:id', protect, upload.single('cover'), async (req, res) => {
  const album = await Album.findById(req.params.id);
  if (!album) return res.status(404).json({ message: 'Album not found' });

  if (req.file) {
    if (album.coverPublicId) await deleteFromCloudinary(album.coverPublicId);
    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/covers');
    req.body.coverImage = result.secure_url;
    req.body.coverPublicId = result.public_id;
  }

  Object.assign(album, req.body);
  await album.save();
  res.json(album);
});

// DELETE /api/albums/:id - admin only
router.delete('/:id', protect, async (req, res) => {
  const album = await Album.findById(req.params.id);
  if (!album) return res.status(404).json({ message: 'Album not found' });

  // Delete cover image from Cloudinary
  if (album.coverPublicId) await deleteFromCloudinary(album.coverPublicId);

  // Delete all photos in album from Cloudinary
  const photos = await Photo.find({ album: req.params.id });
  await Promise.all(photos.map(p => deleteFromCloudinary(p.publicId)));
  await Photo.deleteMany({ album: req.params.id });

  await album.deleteOne();
  res.json({ message: 'Album and all photos deleted' });
});

module.exports = router;
