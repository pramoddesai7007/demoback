const mongoose = require('mongoose');
const { Schema } = mongoose;

const mainCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    menus: [{
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Menu',
        },
        name: String,
        price: Number,
        imageUrl: String, // Add imageUrl to the schema

    }],
    mainImage: {
        type: String, // Assuming the image will be stored as a URL
    },
});

const MainCategory = mongoose.model('MainCategory', mainCategorySchema);
module.exports = MainCategory;
