const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employer = require('../models/Employer');
const { auth, SECRET } = require('../middleware/auth');

// POST register employer
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, company } = req.body;
    if (!name || !email || !password || !company) {
      return res.status(400).json({ error: 'name, email, password, and company are required' });
    }
    const existing = await Employer.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const employer = new Employer({ ...req.body, password: hashed });
    await employer.save();
    res.status(201).json({ message: 'Employer registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }
    const employer = await Employer.findOne({ email });
    if (!employer) return res.status(404).json({ error: 'Employer not found' });

    const match = await bcrypt.compare(password, employer.password);
    if (!match) return res.status(401).json({ error: 'Wrong password' });

    const token = jwt.sign({ id: employer._id, role: 'employer' }, SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
// GET employer profile (protected)
router.get('/:id', auth, async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id).select('-password');
    if (!employer) return res.status(404).json({ error: 'Employer not found' });
    res.json(employer);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update employer (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const employer = await Employer.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(employer);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
