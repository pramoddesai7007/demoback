const express = require('express');
const OrderHistory = require('../models/OrderHIstory');
const router = express.Router();


router.post('/log-history', async (req, res) => {
    try {
        const { orderNumber, updatedBy, timestamp, updatedFields } = req.body;

        // Log the order history
        await OrderHistory.create({
            orderNumber,
            updatedBy,
            timestamp,
            updatedFields,
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error logging order history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/order-history/:orderNumber', async (req, res) => {
    try {
        const { orderNumber } = req.params;

        // Fetch order history records for the specified orderNumber
        const orderHistory = await OrderHistory.find({ orderNumber });

        res.json(orderHistory);
    } catch (error) {
        console.error('Error fetching order history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/order-history', async (req, res) => {
    try {
        // Fetch all order history records
        const allOrderHistory = await OrderHistory.find();

        res.json(allOrderHistory);
    } catch (error) {
        console.error('Error fetching all order history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router