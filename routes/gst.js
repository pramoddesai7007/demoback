// routes/gstRoutes.js
const express = require('express');
const router = express.Router();
const GST = require('../models/GST');

// Create or update GST information
// routes/gstRoutes.js
router.post('/create', async (req, res) => {
    const { gstPercentage } = req.body;

    try {
        // Check if GST entry with the given percentage already exists
        const existingGST = await GST.findOne({ gstPercentage });

        if (existingGST) {
            return res.status(400).json({ error: 'GST entry with this percentage already exists' });
        }

        // Create a new GST document
        const gstInfo = new GST({ gstPercentage });
        await gstInfo.save();

        res.status(200).json(gstInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Update the GST percentage
router.put('/gst/:id', async (req, res) => {
    const { id } = req.params;
    const { gstPercentage } = req.body;

    try {
        const gstInfo = await GST.findById(id);

        if (!gstInfo) {
            return res.status(404).json({ error: 'GST information not found' });
        }

        gstInfo.gstPercentage = gstPercentage;
        await gstInfo.save();

        res.status(200).json(gstInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// routes/gstRoutes.js
router.get('/list', async (req, res) => {
    try {
        const gstList = await GST.find();
        res.status(200).json(gstList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// routes/gstRoutes.js
router.delete('/gst/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedGst = await GST.findByIdAndDelete(id);

        if (!deletedGst) {
            return res.status(404).json({ message: 'GST information not found' });
        }

        res.status(200).json({ message: 'GST information deleted successfully', deletedGst });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
