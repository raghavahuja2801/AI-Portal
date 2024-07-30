const mongoose = require('mongoose');

const EmployerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  companyDescription: {
    type: String,
  },
  website: {
    type: String,
  },
});

module.exports = mongoose.model('Employer', EmployerSchema);
