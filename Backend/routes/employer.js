const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Employer = require('../models/Employer');
const Job = require('../models/Job');
const checkEmployer = require('../middleware/checkEmployer');


// Create a job listing
router.post('/job', [auth, checkEmployer], async (req, res) => {
  const { jobTitle, jobDescription, company, salaryRange, skillsRequired, remoteAllowed, location } = req.body;

  try {
    console.log(req.empl)
    // Ensure `salaryRange` has min and max
    if (!salaryRange || typeof salaryRange.min !== 'number' || typeof salaryRange.max !== 'number') {
      return res.status(400).json({ msg: 'Invalid salary range' });
    }
    const newJob = new Job({
      employer: req.employer.user, // Assuming `checkEmployer` middleware sets `req.employer`
      jobTitle,
      jobDescription,
      company : req.employer.company,
      salaryRange,
      skillsRequired,
      remoteAllowed,
      location
    });

    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


module.exports = router;
