// models/StockOutward.js

const mongoose = require('mongoose');

const stockOutSchema = new mongoose.Schema({
    waiterName: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    stockQty: {
        type: Number,
        required: true,
    },
    availableQuantity: {
        type: String,
    },
});

const StockOut= mongoose.model('StockOutward', stockOutSchema);

module.exports = StockOut;
