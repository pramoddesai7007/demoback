const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  contactNo: {
    type: Number,
    required: true,
    unique: true,
  },
  stockQty: {
    type: Number,
    required: true,
  },
  mainQty: {
    type: Number,
    required: true,
  },
});

const Stock = mongoose.model("stock", stockSchema);
module.exports = Stock;
