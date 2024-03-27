const express = require('express');
const Waiter = require('../models/Waiter');
const router = express.Router();

// Create Waiter
// router.post('/', async (req, res) => {
//   try {
//     const { waiterName, address, contactNumber,uniqueId  } = req.body;
//     const newWaiter = new Waiter({ waiterName, address, contactNumber,uniqueId  });
//     const savedWaiter = await newWaiter.save();
//     res.json(savedWaiter);
//   } catch (error) {
//     console.error('Error creating waiter:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
router.post('/', async (req, res) => {
  try {
    const { waiterName, address, contactNumber, uniqueId } = req.body;

    // Check if a waiter with the same uniqueId exists
    const existingWaiterByUniqueId = await Waiter.findOne({ uniqueId: uniqueId });

    if (existingWaiterByUniqueId) {
      return res.status(400).json({ message: 'Waiter with the same uniqueId already exists' });
    }

    const newWaiter = new Waiter({ waiterName, address, contactNumber, uniqueId });
    const savedWaiter = await newWaiter.save();
    res.json(savedWaiter);
  } catch (error) {
    console.error('Error creating waiter:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get All Waiters
router.get('/', async (req, res) => {
  try {
    const waiters = await Waiter.find();
    res.json(waiters);
  } catch (error) {
    console.error('Error getting waiters:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get Waiter by ID
router.get('/:id', async (req, res) => {
  try {
    const waiter = await Waiter.findById(req.params.id);
    if (waiter) {
      res.json(waiter);
    } else {
      res.status(404).json({ error: 'Waiter not found' });
    }
  } catch (error) {
    console.error('Error getting waiter by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get Waiter's Mobile Number by Name
router.get('/waiter/mobile', async (req, res) => {
    try {
      const { name } = req.query;
      const waiter = await Waiter.findOne({ waiterName: name });
      if (waiter) {
        res.json({ mobileNumber: waiter.contactNumber });
      } else {
        res.status(404).json({ error: 'Waiter not found' });
      }
    } catch (error) {
      console.error('Error getting waiter by name:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  

// Update Waiter by ID
// router.put('/:id', async (req, res) => {
//   try {
//     const updatedWaiter = await Waiter.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (updatedWaiter) {
//       res.json(updatedWaiter);
//     } else {
//       res.status(404).json({ error: 'Waiter not found' });
//     }
//   } catch (error) {
//     console.error('Error updating waiter by ID:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
router.put('/:id', async (req, res) => {
  try {
    const existingWaiter = await Waiter.findOne({ uniqueId: req.body.uniqueId });
    if (existingWaiter && existingWaiter._id != req.params.id) {
      // If a waiter with the same uniqueId exists and it's not the current waiter being updated
      return res.status(400).json({ error: 'Waiter with the same Unique ID already exists' });
    }

    const updatedWaiter = await Waiter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (updatedWaiter) {
      res.json(updatedWaiter);
    } else {
      res.status(404).json({ error: 'Waiter not found' });
    }
  } catch (error) {
    console.error('Error updating waiter by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete Waiter by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedWaiter = await Waiter.findByIdAndDelete(req.params.id);
    if (deletedWaiter) {
      res.json({ message: 'Waiter deleted successfully' });
    } else {
      res.status(404).json({ error: 'Waiter not found' });
    }
  } catch (error) {
    console.error('Error deleting waiter by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;