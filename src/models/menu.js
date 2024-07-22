const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
        },
        ingredients: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        restaurant:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
