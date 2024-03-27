// models/Menu.js
const mongoose = require('mongoose');
const { Schema } = mongoose;


const menuSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },

    imageUrl: {
        type: String, // Assuming the image will be stored as a URL

    },
    uniqueId: {
        type: String,
        // unique: true,
    },
    itemName:
    {
        type: String,
        // required: true 
    },
    stockQty:
    {
        type: Number,
        default: 0
    },
});

const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;
