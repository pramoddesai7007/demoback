// const mongoose = require('mongoose');

// const customerSchema = new mongoose.Schema({
//     customerName: {
//         type: String,
//         // required: true,
//     },
//     mobileNumber: {
//         type: String,
//         unique: true,
//         // required: true,
//     },
//     creditBalance: {
//         type: Number,
//         // default: 0,
//     },



    
// });

// const Customer = mongoose.model('Customer', customerSchema);

// module.exports = Customer;
// const mongoose = require('mongoose');

// const customerSchema = new mongoose.Schema({
//     customerName: {
//         type: String,
//         // required: true,
//     },
//     mobileNumber: {
//         type: String,
//         unique: true,
//         // required: true,
//     },
//     creditBalance: {
//         type: Number,
//         // default: 0,
//     },
//     balance: {
//         type: Number,
//         // default: 0,
//     },
//     debit: {
//         type: Number,
//         // default: 0,
//     },
// });

// const Customer = mongoose.model('Customer', customerSchema);

// module.exports = Customer;


const mongoose = require('mongoose');

const dateWiseRecordSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  debit: { type: Number, required: true, min: 0 },
});

const customerSchema = new mongoose.Schema({
  customerName: {
    type: String,
    // required: true,
  },
  mobileNumber: {
    type: Number,
    unique: true,
    // required: true,
  },
  creditBalance: {
    type: Number,
    // default: 0,
  },
  debit: {
    type: Number,
    // default: 0,
  },
  balance: {
    type: Number,
   
  },
  dateWiseRecords: [dateWiseRecordSchema],
  // Add more fields as needed
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;