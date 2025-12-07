const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Resume = require('../models/Resume');

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'))
  },
  filename: function (req, file, cb) {
    // Keep original extension, add specific timestamp to ensure uniqueness
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDFs are allowed!'), false);
    }
  } 
});

// Middleware to check if user is authenticated (for uploads)
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// @route   POST /api/resumes/upload
// @desc    Upload a new resume
// @access  Private
router.post('/upload', ensureAuth, upload.single('resume'), async (req, res) => {
  try {
    console.log('Upload route hit');
    console.log('User:', req.user);
    console.log('File:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newResume = await Resume.create({
      user: req.user._id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      // Default rating 1200
    });

    res.status(201).json(newResume);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error during upload', error: err.message });
  }
});

// @route   GET /api/resumes/random
// @desc    Get one random resume (weighted)
// @access  Public
router.get('/random', async (req, res) => {
    try {
        const { excludeId } = req.query;

        // Weighted random selection:
        // 1. Give user-uploaded resumes significantly higher weight (e.g. 5x chance)
        // Implementation:
        // We can pick a random number.
        // Or simpler for MVP: 
        // 50% chance to pick from "User Uploaded" pool
        // 50% chance to pick from "System/All" pool
        
        let pool = {};
        // 50% chance to try to get a user uploaded resume
        if (Math.random() > 0.5) {
             pool = { user: { $ne: null } };
        }
        
        if (excludeId) {
            pool._id = { $ne: excludeId };
        }

        let count = await Resume.countDocuments(pool);
        
        // If no user resumes found (early stage), fallback to all
        if (count === 0) {
            pool = {};
            if (excludeId) {
                pool._id = { $ne: excludeId };
            }
            count = await Resume.countDocuments(pool);
        }

        const random = Math.floor(Math.random() * count);
        const resume = await Resume.findOne(pool).skip(random);

        res.json(resume);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/resumes/pair
// @desc    Get two random resumes for voting
// @access  Public
router.get('/pair', async (req, res) => {
  try {
    // Get first one
    // Reuse the random logic? Let's just do it manually here for simplicity to ensure distinctness
    
    // Resume 1
    const count = await Resume.countDocuments();
    const random1 = Math.floor(Math.random() * count);
    const resume1 = await Resume.findOne().skip(random1);

    // Resume 2
    let resume2;
    let attempts = 0;
    while (!resume2 && attempts < 5) {
        const random2 = Math.floor(Math.random() * count);
         // Ensure we don't pick the same index (roughly) or same ID
         const candidate = await Resume.findOne().skip(random2);
         if (candidate && candidate._id.toString() !== resume1._id.toString()) {
             resume2 = candidate;
         }
         attempts++;
    }
    
    // Fallback if small db
    if (!resume2) {
         return res.status(400).json({ message: 'Not enough resumes to vote' });
    }

    res.json({ pair: [resume1, resume2] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/resumes/vote
// @desc    Vote for a resume
// @access  Public
router.post('/vote', async (req, res) => {
  try {
    const { winnerId, loserId } = req.body;

    const winner = await Resume.findById(winnerId);
    const loser = await Resume.findById(loserId);

    if (!winner || !loser) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Elo Calculation
    const K = 32;
    
    const expectedScoreWinner = 1 / (1 + Math.pow(10, (loser.rating - winner.rating) / 400));
    const expectedScoreLoser = 1 / (1 + Math.pow(10, (winner.rating - loser.rating) / 400));

    winner.rating = Math.round(winner.rating + K * (1 - expectedScoreWinner));
    loser.rating = Math.round(loser.rating + K * (0 - expectedScoreLoser));

    winner.wins += 1;
    loser.losses += 1;

    await winner.save();
    await loser.save();

    res.json({ message: 'Vote recorded', winnerCurrentRating: winner.rating, loserCurrentRating: loser.rating });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/resumes/leaderboard
// @desc    Get top resumes
// @access  Public
router.get('/leaderboard', async (req, res) => {
    try {
        const resumes = await Resume.find()
            .sort({ rating: -1 })
            .limit(50)
            .populate('user', 'name avatar'); // Populate user info if available
        res.json(resumes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/resumes/mine
// @desc    Get current user's resumes
// @access  Private
router.get('/mine', ensureAuth, async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user._id })
            .sort({ uploadedAt: -1 });
        res.json(resumes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
