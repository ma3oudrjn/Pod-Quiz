const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Restaurant',
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem'
    }]
});

const cartSchema = new mongoose.Schema({
    orders: [orderSchema],
    totalAmount: {
        type: Number
    },
    status: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        default: "pending"
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    deliveryAddress: {
        city: { type: String },
        province: { type: String },
        postalCode: { type: String },
        mapLocation: { type: String }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);
