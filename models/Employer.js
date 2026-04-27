const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  company: { type: String, required: true },
  website: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employer', employerSchema);