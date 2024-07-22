const mongoose = require("mongoose")

const restaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
        },
        description: {
            type: String,
            minlength: 10,
        },
        address: {
            city: { type: String },
            province: { type: String },
            postalCode: { type: String },
            mapLocation: { type: String },
        },
        menu: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'MenuItem'
            }
        ],
        isActive:{
            type: Boolean,
            default:true
        },

    },
    {
        timestamps: true,
        collection: "restaurant",
    }
);

restaurantSchema.index({ 'address.city': 1 });
restaurantSchema.index({ 'address.province': 1 });
restaurantSchema.index({ 'address.postalCode': 1 });
restaurantSchema.index({ name: 1 });

module.exports = mongoose.model('Restaurant', restaurantSchema);



