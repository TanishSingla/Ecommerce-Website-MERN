const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    price: {
        type: Number,
        min: 10,
        required: [true, "Price is required"]
    },
    image: {
        type: String,
        required: [true, "Image is required"]
    },
    category: {
        type: String,
        required: [true, "Category is required"]
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product; // Change export statement to CommonJS syntax
