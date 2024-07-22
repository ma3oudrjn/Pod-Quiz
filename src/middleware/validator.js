const account = require('../models/account');
const restaurant = require('../models/restaurant');
const Restaurant = require('../models/restaurant');
const MenuItem = require('../models/menu');

const mongoose = require('mongoose');
const {passwordStrength} = require('check-password-strength');
const {isMobilePhone} = require('validator');

const isMobile = (value) => {
    return typeof value === 'string' && isMobilePhone(value, ['fa-IR']);
};

const isMongoObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.registerAccount = async (req, res, next) => {
    const {phoneNumber, firstName, lastName, password, role} = req.body;
    const errors = [];
    const validRoles = ["customer", "business"]
    if (!isMobile(phoneNumber)) {
        errors.push({message: 'Invalid phone number format'});
    }

    const user = await account.findOne({phoneNumber}).lean();
    if (user) {
        errors.push({message: 'User allready registered'});
    }

    if (!firstName || !lastName) {
        errors.push({message: 'First name and last name are required'});
    }

    if (!password) {
        errors.push({message: 'Password is required'});
    } else if (passwordStrength(password).id <= 1) {
        errors.push({message: 'Password strength is too weak'});
    }

    if (!validRoles.includes(role)) {
        errors.push({message: 'Invalid role'});
    }

    if (errors.length > 0) {
        return res.status(400).json(errors);
    }

    next();
}

exports.isOwnerOfRestaurant = async (req, res, next) => {
    const restaurantId = req.body.restaurantId || req.params.restaurantId;
    const {accountId} = req.accountInfo;

    try {
        const restaurantOwner = await account.findById(accountId);

        if (!restaurantOwner) {
            return res.status(404).json({message: "Owner not found"});
        }

        if (!restaurantOwner.restaurants.includes(restaurantId)) {
            return res.status(403).json({message: "You are not the owner of this restaurant"});
        }

        next();
    } catch (error) {
        console.error("Error checking restaurant ownership:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

exports.postMenuCheck = async (req, res, next) => {
    const {name, price, ingredients, restaurantId} = req.body;
    try {
        const errors = [];
        if (!name || !price || !ingredients || !restaurantId) {
            errors.push({message: "Please fill in the blank"})
        }
        if (!isMongoObjectId(restaurantId)) {
            errors.push({message: "not valid id"})
        }
        if (!await restaurant.findById(restaurantId)) {
            errors.push({message: "Restaurant not found"})
        }

        next()
    } catch (error) {
        console.error("Error checking restaurant ownership:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

exports.validateCart = async (req, res, next) => {
    const { order } = req.body;

    try {
        const errors = [];

        if (!order || !Array.isArray(order) || order.length === 0) {
            errors.push({ message: "Order must be a non-empty array" });
        } else {
            for (const newOrder of order) {
                const { restaurant, items } = newOrder;

                if (!restaurant || !isMongoObjectId(restaurant)) {
                    errors.push({ message: `Invalid or missing restaurant ID` });
                } else if (!await Restaurant.findById(restaurant)) {
                    errors.push({ message: `Restaurant with ID ${restaurant} not found` });
                }
                if (!items || !Array.isArray(items) || items.length === 0) {
                    errors.push({ message: `Items list must be a non-empty array` });
                } else {
                    for (const itemId of items) { // Directly iterate through item IDs
                        if (!itemId || !isMongoObjectId(itemId)) {
                            errors.push({ message: `Invalid or missing item ID ${itemId}` });
                        } else if (!await MenuItem.findById(itemId)) {
                            errors.push({ message: `MenuItem with ID ${itemId} not found` });
                        }
                    }
                }
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        next();
    } catch (error) {
        console.error("Error validating cart:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

