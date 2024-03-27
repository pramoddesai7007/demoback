const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  unit: {
    type: String,
    required: true,
    unique: true,
  },
});

const Unit = mongoose.model('Unit', unitSchema);

module.exports = Unit;