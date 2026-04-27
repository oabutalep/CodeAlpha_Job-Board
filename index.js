const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/jobboard')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/jobs', require('./routes/jobs'));
app.use('/employers', require('./routes/employers'));
app.use('/candidates', require('./routes/candidates'));
app.use('/applications', require('./routes/applications'));

app.listen(3000, () => console.log('Server running on port 3000'));