const express = require('express');
const router = express.Router();
const { Achievement } = require('../models');
const { protect } = require('../middleware/auth');

// GET /api/achievements - public
router.get('/', async (req, res) => {
  const { category, featured } = req.query;
  const filter = {};
  if (category && category !== 'All') filter.category = category;
  if (featured === 'true') filter.featured = true;
  const achievements = await Achievement.find(filter).sort({ order: 1, year: -1 });
  res.json(achievements);
});

// POST /api/achievements - admin only
router.post('/', protect, async (req, res) => {
  const achievement = await Achievement.create(req.body);
  res.status(201).json(achievement);
});

// PUT /api/achievements/:id - admin only
router.put('/:id', protect, async (req, res) => {
  const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
  res.json(achievement);
});

// DELETE /api/achievements/:id - admin only
router.delete('/:id', protect, async (req, res) => {
  const achievement = await Achievement.findByIdAndUpdate(req.params.id);
  if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
  await achievement.deleteOne();
  res.json({ message: 'Achievement deleted' });
});

module.exports = router;
