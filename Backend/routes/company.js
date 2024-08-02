const express = require('express');
const Company = require('../models/Company')
const Employer = require('../models/Employer')
const auth = require('../middleware/auth')

const router = express.Router();

// Create a new company
router.post('/',auth, async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).send(company);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).send(companies);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific company by ID
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).send();
    }
    res.status(200).send(company);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a company by ID
router.patch('/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['companyName', 'email', 'phoneNumber'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).send();
    }

    updates.forEach((update) => (company[update] = req.body[update]));
    await company.save();
    res.status(200).send(company);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a company by ID
router.delete('/:id', async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    if (!company) {
      return res.status(404).send();
    }

    res.status(200).send(company);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Link employer to a company
router.post('/link', auth, async (req, res) => {
  const { companyId } = req.body;

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    let employer = await Employer.findOne({ user: req.user.id });

    if (employer) {
      // Update existing employer data
      employer.company = companyId;
      await employer.save();
      return res.json(employer);
    }

    // Create new employer data
    employer = new Employer({
      user: req.user.id,
      company: companyId,
    });

    await employer.save();
    res.json(employer);
  } catch (err) {
    console.log(req.user)
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
