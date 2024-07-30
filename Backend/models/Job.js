const mongoose = require('mongoose');

// Define the schema for a job
const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  jobDescription: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  salaryRange: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  skillsRequired: [{
    type: String,
    required: true,
    trim: true
  }],
  remoteAllowed: {
    type: Boolean,
    required: true,
    default: false
  },
  location: {
    type: String,
    required: function() {
      return !this.remoteAllowed;
    },
    trim: true
  }
});

// Create the model from the schema and export it
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
