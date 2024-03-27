const mongoose = require('mongoose');

// Define Taste Schema
const tasteSchema = new mongoose.Schema({
    taste: {
        type: String,
        required: true,
    },
});

// Create Taste model
const Taste = mongoose.model('Taste', tasteSchema);

module.exports = Taste;