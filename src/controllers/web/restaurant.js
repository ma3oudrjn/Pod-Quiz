const restaurant = require('../../models/restaurant');
class RestaurantController {





    async getRestaurantByCity(req, res)  {
    const { city, province } = req.query;

try {
    const query = {};

    if (city) query['address.city'] = city;
    if (province) query['address.province'] = province;

    const restaurants = await restaurant.find(query).lean();

    res.status(200).json({ success: true, data: restaurants });
} catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
}
};

    async getRestaurantByid(req, res) {
        const {id} = req.params;
        try{
            const Restaurant = await restaurant.findById(id)
                .populate('MenuItem').lean()
            return res.status(200).json({Restaurant})
        }catch(error){
            console.error("Error adding restaurant:", error);
            return res.status(500).json({success: false, message: "Internal server error"});
        }
    }


}
module.exports = new RestaurantController()
