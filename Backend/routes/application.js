// routes/applications.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkEmployer = require('../middleware/checkEmployer');
const Application = require('../models/Application');
const Job = require('../models/Job');

// Submit a job application
router.post('/', auth, async (req, res) => {
  try {
    const { jobId, resume, coverLetter } = req.body;

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ msg: 'You have already applied for this job' });
    }

    const newApplication = new Application({
      job: jobId,
      applicant: req.user.id,
      resume,
      coverLetter
    });

    const application = await newApplication.save();
    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all applications for a user
router.get('/my-applications', auth, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('job', 'jobTitle company')
      .sort({ appliedDate: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all applications for a job (for employers)
router.get('/job/:jobId', [auth, checkEmployer], async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Check if the employer owns this job listing
    if (job.employer.toString() !== req.employer.user.toString()) {
      return res.status(401).json({ msg: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email')
      .sort({ appliedDate: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update application status (for employers)
router.put('/:id', [auth, checkEmployer], async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    const job = await Job.findById(application.job);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Check if the employer owns the job this application is for
    if (job.employer.toString() !== req.employer.user.toString()) {
      return res.status(401).json({ msg: 'Not authorized to update this application' });
    }

    application.status = status;
    application.lastUpdated = Date.now();

    await application.save();
    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete an application (for users)
router.delete('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    // Check if the user owns this application
    if (application.applicant.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to delete this application' });
    }

    await application.remove();
    res.json({ msg: 'Application removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;