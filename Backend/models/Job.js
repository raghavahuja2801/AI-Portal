const express = require('express');
const mongoose = require('mongoose');

// Define the schema for a job
const jobSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
    trim: true
  },
  Description: {
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
    type: [String],
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
  },
  experience: {
    type: String,
  } ,
  applicants:{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'UserProfile',
  },
});

// Create the model from the schema and export it
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
