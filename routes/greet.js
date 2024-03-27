// router.js
const express = require('express');

const bodyParser = require('body-parser');
const Greet = require('../models/Greet');


const router = express();


// Connect to MongoDB


// Middleware
router.use(bodyParser.json());

// CRUD Routes

// Define the route to create a greet
router.post('/greet', async (req, res) => {
  try {
    // Check if a greet already exists in the database
    const existingGreet = await Greet.findOne();

    // If a greet already exists, return an error
    if (existingGreet) {
      return res.status(400).json({ message: 'A greet already exists' });
    }

    // If no greet exists, create a new one
    const newGreet = await Greet.create(req.body);
    res.status(201).json(newGreet);
  } catch (error) {
    console.error('Error creating greet:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read (Get) Operation
router.get('/greet', async (req, res) => {
  try {
    const greetings = await Greet.find();
    res.json(greetings);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update (Edit) Operation
router.patch('/greet/:id', async (req, res) => {
    try {
      const updatedGreet = await Greet.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedGreet);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Delete (Delete) Operation
  router.delete('/greet/:id', async (req, res) => {
    try {
      const deletedGreet = await Greet.findByIdAndDelete(req.params.id);
      res.json(deletedGreet);
      
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Start the server
module.exports = router;
