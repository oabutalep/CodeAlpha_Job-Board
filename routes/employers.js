const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employer = require('../models/Employer');
const { auth, SECRET } = require('../middleware/auth');

// POST register employer
router.post('/register', async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const employer = new Employer({ ...req.body, password: hashed });
    await employer.save();
    res.status(201).json({ message: 'Employer registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST login employer
router.post('/login', async (req, res) => {
  try {
    const employer = await Employer.findOne({ email: req.body.email });
    if (!employer) return res.status(404).json({ error: 'Employer not found' });

    const match = await bcrypt.compare(req.body.password, employer.password);
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