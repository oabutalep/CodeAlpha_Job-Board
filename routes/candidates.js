const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Candidate = require('../models/Candidate');
const { auth, SECRET } = require('../middleware/auth');

// POST register candidate
router.post('/register', async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const candidate = new Candidate({ ...req.body, password: hashed });
    await candidate.save();
    res.status(201).json({ message: 'Candidate registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST login candidate
router.post('/login', async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ email: req.body.email });
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    const match = await bcrypt.compare(req.body.password, candidate.password);
    if (!match) return res.status(401).json({ error: 'Wrong password' });

    const token = jwt.sign({ id: candidate._id, role: 'candidate' }, SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET candidate profile (protected)
router.get('/:id', auth, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).select('-password');
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update candidate (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;