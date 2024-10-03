const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Employer = require('../models/Employer');
const Job = require('../models/Job');
const checkEmployer = require('../middleware/checkEmployer');

// Create a job listing
router.post('/', [auth, checkEmployer], async (req, res) => {
  const { jobTitle, jobDescription, salaryRange, skillsRequired, remoteAllowed, location } = req.body;
  try {
    // Ensure `salaryRange` has min and max
    if (!salaryRange || typeof salaryRange.min !== 'number' || typeof salaryRange.max !== 'number') {
      return res.status(400).json({ msg: 'Invalid salary range' });
    }
    const newJob = new Job({
      employer: req.employer.user, // Assuming `checkEmployer` middleware sets `req.employer`
      jobTitle,
      jobDescription,
      company: req.employer.company,
      salaryRange,
      skillsRequired,
      remoteAllowed,
      location
    });
    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get all job listings
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ date: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get a specific job listing
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Update a job listing
router.put('/:id', [auth, checkEmployer], async (req, res) => {
  const { jobTitle, jobDescription, salaryRange, skillsRequired, remoteAllowed, location } = req.body;
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }
    // Check if the employer owns this job listing
    if (job.employer.toString() !== req.employer.user.toString()) {
      return res.status(401).json({ msg: 'Not authorized to update this job' });
    }
    // Update fields
    job.jobTitle = jobTitle || job.jobTitle;
    job.jobDescription = jobDescription || job.jobDescription;
    job.salaryRange = salaryRange || job.salaryRange;
    job.skillsRequired = skillsRequired || job.skillsRequired;
    job.remoteAllowed = remoteAllowed !== undefined ? remoteAllowed : job.remoteAllowed;
    job.location = location || job.location;

    await job.save();
    res.json(job);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Delete a job listing
router.delete('/:id', [auth, checkEmployer], async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }
    // Check if the employer owns this job listing
    if (job.employer.toString() !== req.employer.user.toString()) {
      return res.status(401).json({ msg: 'Not authorized to delete this job' });
    }
    await job.remove();
    res.json({ msg: 'Job removed' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Search for jobs
router.get('/search', async (req, res) => {
  try {
    const { query, location, remote } = req.query;
    let searchCriteria = {};

    if (query) {
      searchCriteria.$or = [
        { jobTitle: { $regex: query, $options: 'i' } },
        { jobDescription: { $regex: query, $options: 'i' } },
        { skillsRequired: { $in: [new RegExp(query, 'i')] } }
      ];
    }

    if (location) {
      searchCriteria.location = { $regex: location, $options: 'i' };
    }

    if (remote === 'true') {
      searchCriteria.remoteAllowed = true;
    }

    const jobs = await Job.find(searchCriteria).sort({ date: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;