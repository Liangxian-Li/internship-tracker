const express = require('express');
const Application = require('../models/Application');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/', async (req, res) => {
  try {
    const { company, role, location, status, dateApplied, notes } = req.body;

    if (!company || !role || !dateApplied) {
      return res.status(400).json({ message: 'Company, role, and dateApplied are required' });
    }

    const application = await Application.create({
      userId: req.userId,
      company,
      role,
      location,
      status,
      dateApplied,
      notes
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating application' });
  }
});

router.get('/', async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching applications' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedApplication = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating application' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedApplication = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!deletedApplication) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting application' });
  }
});

module.exports = router;