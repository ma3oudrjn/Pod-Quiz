const mongoose = require("mongoose")

const accountSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["customer", "business", "admin"],
            default: "customer"
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        addresses: [{
            city: {type: String},
            province: {type: String},
            postalCode: {type: String},
            mapLocation: {type: String},
        }],
        isActive: {
            type: Boolean,
            default: false
        },
        email: {
            type: String,
        },
        otp:{
            type: Number,
        },
        password: {
            type: String,
        },
        restaurants:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Restaurant'
            }
        ]


    },
    {
        timestamps: true,
        collection: "account",
    }
);

accountSchema.index({firstName: 1})
accountSchema.index({lastName: 1})
accountSchema.index({email: 1})
accountSchema.index({phoneNumber: 1})

module.exports = mongoose.model('Account', accountSchema);
