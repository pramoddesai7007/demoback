const express = require('express');
const Payment = require('../models/Payment');
const router = express.Router();

router.post('/payments', async (req, res) => {
  try {
    const { tableId, cashAmount, onlinePaymentAmount, totalAmount, dueAmount, discount, orderNumber, } = req.body;

    // Create a new payment with the provided orderNumber
    const payment = new Payment({
      tableId,
      cashAmount,
      onlinePaymentAmount,
      totalAmount,
      dueAmount,
      discount,
      orderNumber,
    });

    // Save the payment
    const savedPayment = await payment.save();

    res.status(201).json(savedPayment);
  } catch (error) {
    console.error('Error saving payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/paymentsList', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/paymentsList/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/latestOrderNumber', async (req, res) => {
  try {
    // Fetch the latest order number from the orders collection
    const latestOrder = await Payment.findOne().sort({ createdAt: -1 });

    // If there are no orders yet, start from 1001 (or any initial order number)
    const latestOrderNumber = latestOrder ? latestOrder.orderNumber + 1 : 1001;

    res.json({ latestOrderNumber });
  } catch (error) {
    console.error('Error fetching latest order number:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/latestBillAmount', async (req, res) => {
  try {
    // Fetch the latest payment
    const latestPayment = await Payment.findOne().sort({ createdAt: -1 });

    // If there are no payments yet, respond with an appropriate message or value
    if (!latestPayment) {
      return res.status(404).json({ error: 'No payments found' });
    }

    // Return the totalAmount of the latest payment
    res.json({ latestBillAmount: latestPayment.totalAmount });
  } catch (error) {
    console.error('Error fetching latest bill amount:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports = router