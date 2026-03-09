const express = require('express');
const router = express.Router();
const { Profile } = require('../models');
const { upload, uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

// GET /api/profile - public
router.get('/', async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) profile = await Profile.create({});
  res.json(profile);
});

// PUT /api/profile - admin only (update text fields)
router.put('/', protect, async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) profile = new Profile();
  Object.assign(profile, req.body);
  await profile.save();
  res.json(profile);
});

// POST /api/profile/avatar - admin only (upload avatar)
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image' });
  let profile = await Profile.findOne();
  if (!profile) profile = new Profile();

  if (profile.avatarPublicId) await deleteFromCloudinary(profile.avatarPublicId);

  const result = await uploadToCloudinary(req.file.buffer, 'portfolio/avatar');
  profile.avatarUrl = result.secure_url;
  profile.avatarPublicId = result.public_id;
  await profile.save();
  res.json(profile);
});

module.exports = router;
