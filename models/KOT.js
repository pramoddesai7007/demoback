const mongoose = require('mongoose');

const KOTSchema = new mongoose.Schema({
    tableId: {
        type: String,
        required: true
    },
    items: [{
        name: String,
        quantity: Number,
        taste: String,
        isCanceled: {
            type: Boolean,
            default: false
        }
    }],
    KOTDate: {
        type: Date,
        default: Date.now // Set as the current Date and Time when the order is saved
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    waiterName: {
        type: String,
    },
    setteled: {
        type: Boolean,
        default: false
    }
});

const KOT = mongoose.model('KOT', KOTSchema);
module.exports = KOT;