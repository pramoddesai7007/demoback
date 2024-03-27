const express = require('express');
const router = express.Router();
const Bank = require('../models/BankName'); // Assuming Bank model is in a file named Bank.js

// Get all bank names
router.get('/bankNames', async (req, res) => {
    try {
      const bankNames = await Bank.find();
      res.json(bankNames);
    } catch (error) {
      console.error('Error fetching bank names:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // Get bank name by ID
  router.get('/bankNames/:id', async (req, res) => {
    try {
      const bankName = await Bank.findById(req.params.id);
      if (!bankName) {
        return res.status(404).json({ message: 'Bank name not found' });
      }
      res.json(bankName);
    } catch (error) {
      console.error('Error fetching bank name by ID:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // Create a new bank name
  router.post('/bankNames', async (req, res) => {
    const { bankName } = req.body;
  
    try {
      const newBank = new Bank({ bankName });
      const savedBank = await newBank.save();
      res.status(201).json(savedBank);
    } catch (error) {
      console.error('Error creating bank name:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // Update bank name by ID
  router.patch('/bankNames/:id', async (req, res) => {
    const { bankName } = req.body;
  
    try {
      const updatedBank = await Bank.findByIdAndUpdate(
        req.params.id,
        { bankName },
        { new: true }
      );
  
      if (!updatedBank) {
        return res.status(404).json({ message: 'Bank name not found' });
      }
  
      res.json(updatedBank);
    } catch (error) {
      console.error('Error updating bank name:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // Delete bank name by ID
  router.delete('/bankNames/:id', async (req, res) => {
    try {
      const deletedBank = await Bank.findByIdAndDelete(req.params.id);
  
      if (!deletedBank) {
        return res.status(404).json({ message: 'Bank name not found' });
      }
  
      res.json(deletedBank);
    } catch (error) {
      console.error('Error deleting bank name:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  module.exports = router;