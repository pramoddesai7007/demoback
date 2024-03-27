const express = require('express');
const Supplier = require('../models/Supplier');
const router = express.Router();

// API route to create a new supplier
// router.post('/suppliers', async (req, res) => {
//     try {
//         const newSupplierData = req.body;
//         newSupplierData.debit = 0; // Initialize debit to 0
//         newSupplierData.credit = 0; // Initialize credit to 0

//         const newSupplier = new Supplier(newSupplierData);
//         await newSupplier.save();
//         res.status(201).json(newSupplier);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
// router.post('/suppliers', async (req, res) => {
//     try {
//         const newSupplierData = req.body;

//         // Check if the email already exists
//         const existingSupplier = await Supplier.findOne({ email: newSupplierData.email });

//         if (existingSupplier) {
//             // If the email is already in use, return a 409 Conflict response
//             return res.status(409).json({ error: 'Email is already in use. Please use a different email.' });
//         }

//         // If the email is not in use, proceed with creating a new supplier
//         newSupplierData.debit = 0; // Initialize debit to 0
//         newSupplierData.credit = 0; // Initialize credit to 0

//         const newSupplier = new Supplier(newSupplierData);
//         await newSupplier.save();

//         res.status(201).json(newSupplier);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


router.get('/openingBalances', async (req, res) => {
  try {
    // Aggregate to calculate opening balance for each vendor
    const openingBalances = await Supplier.aggregate([
      {
        $project: {
          vendorName: 1,
          openingBalance: { $subtract: ["$credit", "$debit"] } // Calculate opening balance
        }
      },
      {
        $match: {
          openingBalance: { $gt: 0 } // Filter only suppliers with opening balance greater than 0
        }
      }
    ]);

    res.status(200).json(openingBalances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// API route to create a new supplier
router.post('/suppliers', async (req, res) => {
    try {
      const newSupplierData = req.body;
  
      newSupplierData.debit = 0; // Initialize debit to 0
      newSupplierData.credit = 0; // Initialize credit to 0
      // Create a new Supplier instance
      const newSupplier = new Supplier(newSupplierData);
  
      // Save the new supplier to the database
      await newSupplier.save();
  
      // Send a success response with the newly created supplier
      res.status(201).json(newSupplier);
    } catch (error) {
      // If an error occurs, send a 500 internal server error response
      res.status(500).json({ error: error.message });
    }
  });


// router.post('/suppliers', async (req, res) => {
//     try {
//         const newSupplierData = req.body;
//         console.log(req.body)
//         // Check if the email already exists
//         const existingSupplier = await Supplier.findOne({ email: newSupplierData.email });

//         if (existingSupplier) {
//             // If the email is already in use, return a 409 Conflict response
//             return res.status(409).json({ error: 'Email is already in use. Please use a different email.' });
//         }

//         // If the email is not in use, proceed with creating a new supplier
//         newSupplierData.debit = 0; // Initialize debit to 0
//         newSupplierData.credit = 0; // Initialize credit to 0

//         const newSupplier = new Supplier(newSupplierData);
//         await newSupplier.save();

//         res.status(201).json(newSupplier);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// API route to get all suppliers
router.get('/suppliers', async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API route to get a specific supplier by ID
// router.get('/suppliers/:id', async (req, res) => {
//     try {
//         const supplier = await Supplier.findById(req.params.id);
//         if (!supplier) {
//             return res.status(404).json({ message: 'Supplier not found' });
//         }
//         res.status(200).json(supplier);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
router.get('/suppliers/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        // Calculate balance dynamically based on debits
        const balance = supplier.credit - supplier.debit;

        // Return supplier details with calculated balance
        res.status(200).json({ ...supplier.toObject(), balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API route to update a specific supplier by ID
// router.patch('/suppliers/:id', async (req, res) => {
//     try {
//         const updatedSupplierData = req.body;

//         // Ensure that debit and credit are not overwritten
//         delete updatedSupplierData.debit;
//         delete updatedSupplierData.credit;

//         const updatedSupplier = await Supplier.findByIdAndUpdate(
//             req.params.id,
//             updatedSupplierData,
//             { new: true }
//         );

//         if (!updatedSupplier) {
//             return res.status(404).json({ message: 'Supplier not found' });
//         }

//         res.status(200).json(updatedSupplier);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// API route to update a specific supplier by ID
router.patch('/suppliers/:id', async (req, res) => {
    const { id } = req.params; // Extract supplier ID from URL params
    const updateData = req.body; // Data to update
  
    try {
      // Find the supplier by ID and update its information
      const updatedSupplier = await Supplier.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!updatedSupplier) {
        // If the supplier with the provided ID is not found, return 404 Not Found
        return res.status(404).json({ error: 'Supplier not found' });
      }
  
      // If the update is successful, return the updated supplier data
      res.json(updatedSupplier);
    } catch (error) {
      // If an error occurs during the update process, return 500 Internal Server Error
      res.status(500).json({ error: error.message });
    }
  });

// API route to delete a specific supplier by ID
router.delete('/suppliers/:id', async (req, res) => {
    try {
        const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!deletedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.status(200).json(deletedSupplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API route to delete a specific dateWiseRecord for a supplier by ID
router.delete('/suppliers/:supplierId/dateWiseRecords/:recordId', async (req, res) => {
    try {
        const { supplierId, recordId } = req.params;

        const supplier = await Supplier.findById(supplierId);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        const recordIndex = supplier.dateWiseRecords.findIndex(record => record._id == recordId);
        if (recordIndex === -1) {
            return res.status(404).json({ message: 'DateWiseRecord not found' });
        }

        // Subtract the deleted debit amount from the supplier's debit field
        const deletedDebitAmount = supplier.dateWiseRecords[recordIndex].debit;
        supplier.debit -= deletedDebitAmount;

        // Add the deleted debit amount back to the supplier's balance
        supplier.openingBalance += deletedDebitAmount;

        // Remove the specific dateWiseRecord
        supplier.dateWiseRecords.splice(recordIndex, 1);
        await supplier.save();

        res.status(200).json({ message: 'DateWiseRecord deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API route to update supplier's debit balance
router.post('/supplier/debit', async (req, res) => {
    try {
        const { vendorName, amount } = req.body;
        const supplier = await Supplier.findOne({ vendorName });

        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        supplier.debit += amount;
        await supplier.save();

        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API route to update supplier's credit balance
router.post('/supplier/credit', async (req, res) => {
    try {
        const { vendorName, amount } = req.body;
        const supplier = await Supplier.findOne({ vendorName });

        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        supplier.credit += amount;
        await supplier.save();

        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


  
router.put('/updateBalance/:id', async (req, res) => {
    try {
      const { debit } = req.body;
  
      // Update the debit amount and date-wise records
      const supplier = await Supplier.findByIdAndUpdate(
        req.params.id,
        {
          $inc: { debit: debit },
          $push: { dateWiseRecords: { debit: debit } },
        },
        { new: true }
      );
  
      if (!supplier) {
        return res.status(404).json({ message: 'Supplier not found' });
      }
  
      // Calculate openingBalance based on the updated balance
      const openingBalance = supplier.credit - supplier.debit;
  
      // Update the openingBalance field
      await Supplier.findByIdAndUpdate(req.params.id, { $set: { openingBalance } });
  
      // Fetch the updated supplier
      const updatedSupplier = await Supplier.findById(req.params.id);
  
      res.status(200).json(updatedSupplier);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports = router;