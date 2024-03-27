const express = require('express');
const router = express.Router();
const Unit = require('../models/Unit');

// Get all units
router.get('/units', async (req, res) => {
  try {
    const units = await Unit.find();
    res.json(units);
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get unit by ID
router.get('/units/:id', async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }
    res.json(unit);
  } catch (error) {
    console.error('Error fetching unit by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Create a new unit
router.post('/units', async (req, res) => {
  const { unit } = req.body;

  try {
    const newUnit = new Unit({ unit });
    const savedUnit = await newUnit.save();
    res.status(201).json(savedUnit);
  } catch (error) {
    console.error('Error creating unit:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update unit by ID
router.patch('/units/:id', async (req, res) => {
  const { unit } = req.body;

  try {
    const updatedUnit = await Unit.findByIdAndUpdate(
      req.params.id,
      { unit },
      { new: true }
    );

    if (!updatedUnit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    res.json(updatedUnit);
  } catch (error) {
    console.error('Error updating unit:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete unit by ID
router.delete('/units/:id', async (req, res) => {
  try {
    const deletedUnit = await Unit.findByIdAndDelete(req.params.id);

    if (!deletedUnit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    res.json(deletedUnit);
  } catch (error) {
    console.error('Error deleting unit:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;