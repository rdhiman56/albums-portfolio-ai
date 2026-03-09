const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, default: 'Trip', enum: ['Trip', 'Achievement', 'Event', 'Other'] },
  location: { type: String, default: '' },
  date: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  coverPublicId: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const photoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', default: null },
  imageUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  year: { type: String, required: true },
  icon: { type: String, default: '🏆' },
  category: { type: String, default: 'Award', enum: ['Award', 'Certification', 'Publication', 'Project', 'Education', 'Other'] },
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', default: null },
  link: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Your Name' },
  tagline: { type: String, default: 'Creative Professional' },
  bio: { type: String, default: 'Tell your story here...' },
  email: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' },
  instagram: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  avatarPublicId: { type: String, default: '' },
  resumeUrl: { type: String, default: '' }
}, { timestamps: true });

const Album = mongoose.model('Album', albumSchema);
const Photo = mongoose.model('Photo', photoSchema);
const Achievement = mongoose.model('Achievement', achievementSchema);
const Profile = mongoose.model('Profile', profileSchema);

module.exports = { Album, Photo, Achievement, Profile };
