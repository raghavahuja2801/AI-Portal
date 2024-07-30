const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Employer = require('../models/Employer');
const Job = require('../models/Job');
const checkEmployer = require('../middleware/checkEmployer')


// Setup employer data
router.post('/setup', auth, async (req, res) => {
    const { companyName, companyDescription, website } = req.body;
  
    try {
      let employer = await Employer.findOne({ user: req.user.id });
  
      if (employer) {
        // Update existing employer data
        employer.companyName = companyName || employer.companyName;
        employer.companyDescription = companyDescription || employer.companyDescription;
        employer.website = website || employer.website;
        await employer.save();
        return res.json(employer);
      }
  
      // Create new employer data
      employer = new Employer({
        user: req.user.id,
        companyName,
        companyDescription,
        website,
      });
  
      await employer.save();
      res.json(employer);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// Create a job listing
router.post('/job', [auth, checkEmployer], async (req, res) => {
  const { title, description, requirements, salary, location } = req.body;

  try {
    const newJob = new Job({
      employer: req.employer.id,
      title,
      description,
      requirements,
      salary,
      location,
    });

    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
