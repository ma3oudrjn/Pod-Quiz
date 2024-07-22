const MenuItem = require('../../models/menu');
const Restaurant = require('../../models/restaurant');
class menuController {


    async createMenuItem(req, res) {
        const {name, price, description, ingredients, restaurantId} = req.body;
        try {
            const newMenuItem = new MenuItem({
                name,
                price,
                description,
                ingredients,
                restaurant:restaurantId,
            });
            await newMenuItem.save();

           await Restaurant.findByIdAndUpdate(restaurantId,{$push:{menu:newMenuItem._id}},{new:true})

            res.status(201).json({success: true, data: newMenuItem});
        } catch (error) {
            console.error(error);
            res.status(500).json({success: false, message: 'Server internal error'});
        }
    }

    async getMenuItems(req, res) {
        const {restaurantId} = req.params
        try {
            const menuItems = await MenuItem.find({m:restaurantId}).populate('restaurant');
            res.status(200).json({success: true, data: menuItems});
        } catch (error) {
            console.error(error);
            res.status(500).json({success: false, message: 'Server internal error'});
        }
    }

    async getMenuItemById(req, res) {
        try {
            const menuItem = await MenuItem.findById(req.params.id)

            if (!menuItem) {
                return res.status(404).json({success: false, message: 'Menu item not found'});
            }

            res.status(200).json({success: true, data: menuItem});
        } catch (error) {
            console.error(error);
            res.status(500).json({success: false, message: 'Server internal error'});
        }
    }

    async updateMenuItem(req, res) {
        const {name, price, description, ingredients} = req.body;

        try {
            const
                menuItem = await MenuItem.findByIdAndUpdate(req.params.id,name, price, description, ingredients, {
                    new: true
                })

            if (!menuItem) {
                return res.status(404).json({success: false, message: 'Menu item not found'});
            }

            res.status(200).json({success: true, data: menuItem});
        } catch
            (error) {
            console.error(error);
            res.status(500).json({success: false, message: 'Server internal error'});
        }
    }

    async deleteMenuItem(req, res) {
    try {
    const
    menuItem = await MenuItem.findByIdAndUpdate(req.params.id,{isActive: false},{new:false});

    if(!menuItem) {return res.status(404).json({success: false, message: 'Menu item not found'});
}

res.status(200).json({success: true, message: 'Menu item deleted'});
} catch (error)
{
    console.error(error);
    res.status(500).json({success: false, message: 'Server internal error'});
}
}
}

module.exports =new menuController();