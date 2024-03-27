// models/GST.js
const mongoose = require('mongoose');

const gstSchema = new mongoose.Schema({
  gstPercentage: {
    type: Number,
    required: true,
    unique:true,
    min: 0,
    max: 100,
  },
});

const GST = mongoose.model('GST', gstSchema);

module.exports = GST;
