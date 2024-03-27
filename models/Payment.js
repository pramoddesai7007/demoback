// const mongoose = require('mongoose');

// const paymentSchema = new mongoose.Schema({
//     tableId: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//     },
//     cashAmount: {
//         type: String,
//         required: true,
//     },
//     onlinePaymentAmount: {
//         type: String,
//         required: true,
//     },
//     totalAmount: {
//         type: Number,
//         required: true,
//     },
//     orderNumber: {
//         type: String, // Assuming orderNumber is a string
//         required: true,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });

// // Add a pre-save hook to generate and set the order number before saving the payment
// paymentSchema.pre('save', async function (next) {
//     try {
//         // Find the highest order number in the collection
//         const highestOrder = await this.constructor.findOne({}, { orderNumber: 1 })
//             .sort({ orderNumber: -1 })
//             .limit(1);

//         let latestOrderNumber;
//         if (highestOrder) {
//             const lastOrderNumber = highestOrder.orderNumber;
//             const orderNumberSuffix = parseInt(lastOrderNumber.replace('ORD-', ''), 10);
//             latestOrderNumber = `ORD-${orderNumberSuffix + 1}`;
//         } else {
//             // Set initial order number if no orders exist
//             latestOrderNumber = 'ORD-1000';
//         }

//         // Set the order number in the document
//         this.orderNumber = latestOrderNumber;

//         next();
//     } catch (error) {
//         next(error);
//     }
// });
// const Payment = mongoose.model('Payment', paymentSchema);

// module.exports = Payment;


const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    cashAmount: {
        type: String,
        required: true,
    },
    onlinePaymentAmount: {
        type: String,
        required: true,
    },
    dueAmount: {
        type: String,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    orderNumber: {
        type: String, // Assuming orderNumber is a string
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Add a pre-save hook to generate and set the order number before saving the payment
paymentSchema.pre('save', async function (next) {
    try {
        // Find the highest order number in the collection
        const highestOrder = await this.constructor.findOne({}, { orderNumber: 1 })
            .sort({ orderNumber: -1 })
            .limit(1);

        let latestOrderNumber;
        if (highestOrder) {
            const lastOrderNumber = highestOrder.orderNumber;
            const orderNumberSuffix = parseInt(lastOrderNumber.replace('ORD-', ''), 10);
            latestOrderNumber = `ORD-${orderNumberSuffix + 1}`;
        } else {
            // Set initial order number if no orders exist
            latestOrderNumber = 'ORD-1000';
        }

        // Set the order number in the document
        this.orderNumber = latestOrderNumber;

        next();
    } catch (error) {
        next(error);
    }
});
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;