const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { auth } = require('../middleware/auth');

// POST apply for a job (protected)
router.post('/', auth, async (req, res) => {
  try {
    const existing = await Application.findOne({
      job: req.body.job,
      candidate: req.user.id
    });
    if (existing) return res.status(400).json({ error: 'Already applied' });

    const application = new Application({
      ...req.body,
      candidate: req.user.id
    });
    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all applications for a candidate (protected)
router.get('/candidate', auth, async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate('job', 'title location type');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all applications for a job (protected)
router.get('/job/:jobId', auth, async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email skills');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update application status (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE cancel application (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application cancelled' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;