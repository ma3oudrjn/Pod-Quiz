const restaurant = require('../../models/restaurant');
const account = require('../../models/account');

class RestaurantController {
    async postNewRestaurant(req, res) {
        const {name, description, address} = req.body;

        try {
            const newRestaurant = new restaurant({name, description, address});
            await newRestaurant.save();

            const updatedRestaurantOwner = await account.findByIdAndUpdate(
                req.accountInfo.accountId,
                {$push: {restaurants: newRestaurant._id}},
                {new: true}
            );

            return res.status(200).json({
                success: true,
                message: "Restaurant added successfully",
                restaurantOwner: updatedRestaurantOwner,
                newRestaurant
            });
        } catch (error) {
            console.error("Error adding restaurant:", error);
            return res.status(500).json({success: false, message: "Internal server error"});
        }
    }

    async updateRestaurant(req, res) {
        const {name, description, address} = req.body;
        const {restaurantId} = req.params
        try {
            const updatedRestaurant =
                await restaurant.findByIdAndUpdate(restaurantId, {name, description, address}, {new: true}).lean()

            return res.status(200).json({
                success: true,
                message: "Restaurant update successfully",
                updatedRestaurant: updatedRestaurant
            });
        } catch (error) {
            console.error("Error adding restaurant:", error);
            return res.status(500).json({success: false, message: "Internal server error"});
        }
    }

    async deleteRestaurant(req, res) {
        const {restaurantId} = req.params
        try {

            const deleteRestaurant =
                await restaurant.findByIdAndUpdate(restaurantId, {isActive:false}, {new: true}).lean()


            return res.status(200).json({
                success: true,
                message: "Restaurant deleted successfully",
                deleteRestaurant: deleteRestaurant.name
            });
        } catch (error) {
            console.error("Error adding restaurant:", error);
            return res.status(500).json({success: false, message: "Internal server error"});
        }
    }



}

module.exports = new RestaurantController()