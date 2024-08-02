const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  name: {
    type: String, // Embedded user field
  },
  email: {
    type: String, // Embedded user field
  },
  resume: {
    type: String,
  },
  skills: {
    type: [String],
  },
  location: {
    type: String,
  },
  remote: {
    type: Boolean,
    default: false,
  },
  bio: {
    type: String,
  },
  experience: {
    type: String,
  },
  jobs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Job',
  },
  degree: {
    type: String,
  },
  major: {
    type: String,
  },
  university: {
    type: String,
  },
  preferred_titles: {
    type: [String],
  },
  workExperience: {
    type: [{
      jobTitle: {type: String},
      jobDescription: {type: String}
    }]
  }
});

// Middleware to populate name and email from User
UserProfileSchema.pre('save', async function (next) {
  if (this.isModified('_id')) {
    const user = await mongoose.model('User').findById(this._id);
    if (user) {
      this.name = user.name;
      this.email = user.email;
    }
  }
  next();
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);
