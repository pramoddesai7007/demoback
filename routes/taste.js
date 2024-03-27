const express = require('express');
const router = express.Router();
const Taste = require('../models/Taste'); // Assuming Taste model is in a file named Taste.js

// Get all tastes
router.get('/tastes', async (req, res) => {
  try {
    const tastes = await Taste.find();
    res.json(tastes);
  } catch (error) {
    console.error('Error fetching tastes:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get taste by ID
router.get('/tastes/:id', async (req, res) => {
  try {
    const taste = await Taste.findById(req.params.id);
    if (!taste) {
      return res.status(404).json({ message: 'Taste not found' });
    }
    res.json(taste);
  } catch (error) {
    console.error('Error fetching taste by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Create a new taste
router.post('/tastes', async (req, res) => {
  const { taste } = req.body;

  try {
    const newTaste = new Taste({ taste });
    const savedTaste = await newTaste.save();
    res.status(201).json(savedTaste);
  } catch (error) {
    console.error('Error creating taste:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
  
});

// Update taste by ID
router.patch('/tastes/:id', async (req, res) => {
  const { taste } = req.body;

  try {
    const updatedTaste = await Taste.findByIdAndUpdate(
      req.params.id,
      { taste },
      { new: true }
    );

    if (!updatedTaste) {
      return res.status(404).json({ message: 'Taste not found' });
    }

    res.json(updatedTaste);
  } catch (error) {
    console.error('Error updating taste:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete taste by ID
router.delete('/tastes/:id', async (req, res) => {
  try {
    const deletedTaste = await Taste.findByIdAndDelete(req.params.id);

    if (!deletedTaste) {
      return res.status(404).json({ message: 'Taste not found' });
    }

    res.json(deletedTaste);
  } catch (error) {
    console.error('Error deleting taste:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;