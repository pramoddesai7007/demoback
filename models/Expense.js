const mongoose = require('mongoose');

// Define Expense Schema
const expenseSchema = new mongoose.Schema({
    expense: {
        type: String,
        required: true,
    },
});

// Create Expense model
const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
