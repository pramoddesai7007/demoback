// const mongoose = require('mongoose');

// const purchaseSchema = new mongoose.Schema({
//     date:{
// type:Date
//     },
//     billNo: {
//         type: String,
//         // required: true,
//     },
//     vendorName: {
//         type: String,
//         // required: true,
//     },
//     items: [
//         {
//             productName: {
//                 type: String,
//                 required: true,
//             },
//             quantity: {
//                 type: Number,
//                 required: true,
//             },
//             unit: {
//                 type: String,
//                 required: true,
//             },
//             pricePerQty: {
//                 type: Number,
//                 required: true,
//             },
//         }
//     ],
//     subtotal: {
//         type: Number,
//         required: true,
//     },
//     gst: {
//         type: Number,
//         required: true,
//     },
//     gstAmount: {
//         type: Number,
      
//     },
//     paidAmount: {
//         type: Number,
//         required: true,
//     },
//     discount: {
//         type: Number,
//     },
//     balance: {
//         type: Number,
//     },
// });

// const Purchase = mongoose.model('Purchase', purchaseSchema);

// module.exports = Purchase;



const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    date: {
        type: Date
    },
    billNo: {
        type: String,
        // required: true,
    },
    vendorName: {
        type: String,
        // required: true,
    },
    items: [
        {
            productName: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            unit: {
                type: String,
                required: true,
            },
            pricePerQty: {
                type: Number,
                required: true,
            },
            gstAmount: {
                type: String
            }
        }
    ],
    subtotal: {
        type: Number,
        required: true,
    },
    gst: {
        type: Number,
        required: true,
    },
    gstAmount: {
        type: Number,

    },
    paidAmount: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
    },
    balance: {
        type: Number,
    },
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
