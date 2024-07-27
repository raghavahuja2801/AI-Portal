// routes/profile.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UserProfile = require('../models/UserProfile');
const upload = require('../middleware/upload')
const natural = require('natural'); // NLP library
const extractTextFromFile = require('../utils/fileParser')


const skillsList = require('../skills')


// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from header
  
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
  
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Invalid token' });
      }
      
      req.user = decoded; // Add user info to request object
      next();
    });
  };

// Get user profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ _id: req.user.id });
    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update user profile
router.post('/', authMiddleware, async (req, res) => {
  const { resume, skills } = req.body;
  const profileFields = { resume, skills };
  console.log(req.user.id)

  try {
    let profile = await UserProfile.findOne({ _id: req.user.id });
    if (profile) {
      // Update existing profile
      profile = await UserProfile.findOneAndUpdate(
        { _id: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // Create new profile
    profile = new UserProfile({ _id: req.user.id, ...profileFields });
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


// Upload resume
router.post('/upload-resume', authMiddleware, upload.single('resume'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }
  
      const filePath = req.file.path;
      const text = await extractTextFromFile(filePath);
  
      // Here you can implement your logic to extract skills and details from text
      const skills = extractSkills(text);
      const details = extractDetailsFromText(text);
  
      // Update the user profile with extracted data
      let profile = await UserProfile.findOne({ _id: req.user.id });
      if (profile) {
        profile.resume = req.file.filename; // Save the filename
        profile.skills = skills;
        // Add other details as needed
        await profile.save();
      } else {
        profile = new UserProfile({
          _id: req.user.id,
          resume: req.file.filename,
          skills: skills,
        });
        await profile.save();
      }
  
      res.json({ msg: 'Resume uploaded and processed', profile });
    } catch (err) {
      res.status(500).send('Server Error');
      console.log(err)
    }
  });
  
  function extractSkills(text) {
    const tokenizer = new natural.WordTokenizer();
    const words = tokenizer.tokenize(text);
    const skills = skillsList.filter(skill => words.includes(skill));
    return skills;
  }
  
  // Dummy function to extract details from text
  const extractDetailsFromText = (text) => {
    // Implement your details extraction logic here
    return {};
  };


module.exports = router;
