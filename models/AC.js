// models/Section.js
const mongoose = require('mongoose');

const ACSchema = new mongoose.Schema({
  isDefault: {
    type: Boolean,
    default: false,
  },
  acPercentage: {
    type: Number,
    default: 0,
  },
});

const AC = mongoose.model('AC', ACSchema);

module.exports = AC;