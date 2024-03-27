const mongoose = require('mongoose');

const orderHistorySchema = new mongoose.Schema({
  orderNumber: String,
  updatedBy: String,
  timestamp: Date,
  updatedFields: Object, // You might adjust this based on your needs
});

const OrderHistory = mongoose.model('OrderHistory', orderHistorySchema);

module.exports = OrderHistory;