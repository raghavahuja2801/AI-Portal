// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;



app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/jobPortal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const employerRoutes = require('./routes/employer')
const companyRoutes = require('./routes/company')
const resumeRoutes = require('./routes/resume')

app.use('/api/profile',profileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/employer', employerRoutes)
app.use('/api/company', companyRoutes)
app.use('/api/resume', resumeRoutes);