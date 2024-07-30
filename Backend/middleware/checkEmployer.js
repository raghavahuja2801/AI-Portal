const Employer = require('../models/Employer')

// Middleware to check if the user is an employer
const checkEmployer = async (req, res, next) => {
    const employer = await Employer.findOne({ user: req.user.id });
    if (!employer) {
      return res.status(403).json({ msg: 'Access denied, only employers can perform this action' });
    }
    req.employer = employer;
    next();
  };

  module.exports = checkEmployer