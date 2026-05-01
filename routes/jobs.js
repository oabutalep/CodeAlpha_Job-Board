const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { auth } = require('../middleware/auth');

// GET all jobs
router.get('/', async (req, res) => {
  try {
    const { location, type, skills } = req.query;
    let filter = { status: 'open' };

    if (location) filter.location = new RegExp(location, 'i');
    if (type) filter.type = type;
    if (skills) filter.skills = { $in: skills.split(',') };

    const jobs = await Job.find(filter).populate('company', 'name website');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('company', 'name website');
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create job (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, location } = req.body;
    if (!title || !description || !location) {
      return res.status(400).json({ error: 'title, description, and location are required' });
    }
    const job = new Job({ ...req.body, company: req.user.id });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE job (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
