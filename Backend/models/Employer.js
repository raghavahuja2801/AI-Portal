const mongoose = require('mongoose');

const EmployerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  }
});

module.exports = mongoose.model('Employer', EmployerSchema);
