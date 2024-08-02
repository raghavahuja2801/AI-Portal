// routes/profile.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UserProfile = require('../models/UserProfile');
const upload = require('../middleware/upload')
const natural = require('natural'); // NLP library
const auth = require('../middleware/auth');
const extractTextFromFile = require('../utils/fileParser');
const re = require('re');


const skillsList = require('../skills')



// Get user profile
router.get('/', auth, async (req, res) => {
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
router.post('/', auth, async (req, res) => {
  const {  location, remote, bio, experience, major, degree, university, preferred_titles } = req.body;
  const profileFields = { location, remote, bio, experience, major, degree, university, preferred_titles};


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
router.post('/upload-resume', auth, upload.single('resume'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }
  
      const filePath = req.file.path;
      const text = await extractTextFromFile(filePath);
  
      // Here you can implement your logic to extract skills and details from text
      const skills = extractSkills(text);
      const details = extractWorkExperience(text);
  
      // Update the user profile with extracted data
      let profile = await UserProfile.findOne({ _id: req.user.id });
      if (profile) {
        profile.resume = req.file.filename; // Save the filename
        profile.skills = skills;
        profile.workExperience = details;
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
      console.log(profile)
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
  
  const extractWorkExperience = (text) => {
    const workExperience = [];

    // Define the regex pattern to match job titles and descriptions
    const experiencePattern = /(Software Engineer Intern|Developer|Intern|Engineer|Analyst)[\s\S]*?(?=PROJECTS|EDUCATION|TECHNICAL SKILLS|$)/gi;
    const matches = text.match(experiencePattern);
    
    if (matches) {
        matches.forEach(match => {
            const lines = match.trim().split('\n');
            const jobTitle = lines[0];
            const description = lines.slice(1).join('\n');
            workExperience.push({ jobTitle, description });
        });
    }

    return workExperience;
};



module.exports = router;
