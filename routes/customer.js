const express = require('express');
const Customer = require('../models/Customer');
const router = express.Router();

router.post('/customer/list/add-customer', async (req, res) => {
    try {
        const { customerName, mobileNumber, creditBalance } = req.body;
        console.log('Incoming Add Customer Request Data:', req.body);  // Log the incoming data

        // Check if the customer already exists
        const existingCustomer = await Customer.findOne({ mobileNumber });
        if (existingCustomer) {
            return res.status(400).json({ error: 'Customer already exists' });
        }

        // Ensure creditBalance is a number, default to 0 if not provided
        const newCustomer = new Customer({
            customerName,
            mobileNumber,
            creditBalance: parseFloat(creditBalance) || 0
        });

        const savedCustomer = await newCustomer.save();

        res.json(savedCustomer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/get-customer-by-mobile/:mobileNumber', async (req, res) => {
    try {
        const { mobileNumber } = req.params;

        // Find the customer by mobile number
        const customer = await Customer.findOne({ mobileNumber });

        if (!customer) {
            res.status(404).json({ error: 'Customer not found' });
        } else {
            res.json(customer);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.patch('/update-credit-balance/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;
        const { creditBalance } = req.body;

        // Check if the customer exists
        const existingCustomer = await Customer.findById(customerId);

        if (!existingCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Ensure creditBalance is a number
        existingCustomer.creditBalance = parseFloat(creditBalance) || 0;

        const updatedCustomer = await existingCustomer.save();

        res.json(updatedCustomer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/customers', async (req, res) => {
    try {
        // Retrieve customers with credit greater than 0 from the database
        const customers = await Customer.find({ creditBalance: { $gt: 0 } });

        // Send the list of customers as a JSON response
        res.json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API to get a list of mobile numbers
router.get('/mobile-numbers', async (req, res) => {
  try {
      // Retrieve mobile numbers from the database
      const mobileNumbers = await Customer.find({}, 'mobileNumber');

      // Extract mobile numbers from the result
      const numbers = mobileNumbers.map((customer) => customer.mobileNumber);

      // Send the list of mobile numbers as a JSON response
      res.json(numbers);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API to get information about a specific customer
router.get('/customers/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;

        // Find the customer by customerId
        const customer = await Customer.findById(customerId);

        // Check if the customer exists
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Send the customer information as a JSON response
        res.json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete(
    "/customers/:customerId/dateWiseRecords/:recordId",
    async (req, res) => {
      try {
        const customerId = req.params.customerId;
        const recordId = req.params.recordId;
  
        // Find the customer by ID
        const customer = await Customer.findById(customerId);
  
        // Check if the customer exists
        if (!customer) {
          return res.status(404).json({ message: "Customer not found" });
        }
  
        // Find the index of the dateWiseRecord in the array
        const recordIndex = customer.dateWiseRecords.findIndex(
          (record) => record._id == recordId
        );
  
        // Check if the record exists
        if (recordIndex === -1) {
          return res.status(404).json({ message: "Record not found" });
        }
  
        // Subtract the deleted debit amount from the customer's debit field
        const deletedDebitAmount = customer.dateWiseRecords[recordIndex].debit;
        customer.debit -= deletedDebitAmount;
  
        // Add the deleted debit amount back to the customer's balance
        customer.balance += deletedDebitAmount;
  
        // Remove the dateWiseRecord from the array
        customer.dateWiseRecords.splice(recordIndex, 1);
  
        // Save the updated customer
        await customer.save();
  
        // Respond with success
        res.status(200).json({ message: "Record deleted successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );
  

router.put('/updateBalance/:id', async (req, res) => {
    try {
        const { debit } = req.body;

        // Update the debit amount and date-wise records
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            {
                $inc: { debit: debit },
                $push: { dateWiseRecords: { debit: debit } },
            },
            { new: true }
        );

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Calculate openingBalance based on the updated balance
        const openingBalance = customer.creditBalance - customer.debit;

        // Update the openingBalance and balance fields
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            { $set: { openingBalance, balance: customer.creditBalance - customer.debit } },
            { new: true }
        );

        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;