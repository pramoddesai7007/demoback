const mongoose = require('mongoose');

// Define bankNameSchema
const bankNameSchema = new mongoose.Schema({
    bankName: {
        type: String,
        required: true,
    },
});

// Create Expense model
const BankName = mongoose.model('BankName', bankNameSchema);

module.exports = BankName;