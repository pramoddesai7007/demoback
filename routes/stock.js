const express = require('express');
const router = express.Router();
const cors = require('cors');
const Stock = require('../models/Stock');



router.use(cors());

// Your schema and model definition go here

// CREATE operation
router.post("/", async (req, res) => {
  try {
    const { contactNo, stockQty, mainQty } = req.body;
    const newStock = new Stock({ contactNo, stockQty, mainQty });
    const savedStock = await newStock.save();
    res.json(savedStock);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ operation (get all stocks)
router.get("/stocks", async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ operation (get a specific stock by ID)
router.get("/stocks/:id", async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    res.json(stock);
  } catch (error) {
    res.status(404).json({ error: "Stock not found" });
  }
});

// UPDATE operation
router.patch("/stocks/:id", async (req, res) => {
  try {
    const { contactNo, stockQty, mainQty } = req.body;
    const updatedStock = await Stock.findByIdAndUpdate(
      req.params.id,
      { contactNo, stockQty, mainQty },
      { new: true }
    );
    res.json(updatedStock);
  } catch (error) {
    res.status(404).json({ error: "Stock not found" });
  }
});

// DELETE operation
router.delete("/stocks/:id", async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.json({ message: "Stock deleted successfully" });
  } catch (error) {
    res.status(404).json({ error: "Stock not found" });
  }
});

module.exports = router;
