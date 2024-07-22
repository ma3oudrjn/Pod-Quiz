const Cart = require('../../models/cart')
const account = require('../../models/account')
const MenuItem = require('../../models/menu')

class cartController {
    async updateOrCreateCart(req, res) {
        const { order } = req.body;
        const { accountId } = req.accountInfo;

        try {
            let cart = await Cart.findOne({ user: accountId, status: 'pending' });
            if (cart) {
                let orderFound = false;
                cart.orders.forEach(existingOrder => {
                    if (existingOrder.restaurant.equals(order[0].restaurant)) {
                        existingOrder.items.push(order[0].items[0]);
                        orderFound = true;
                    }
                });
                if (!orderFound) {
                    cart.orders.push(order[0]);
                }
                await cart.save();
            } else {
                const newCart = new Cart({
                    orders: order,
                    user: accountId,
                    status: 'pending'
                });

                await newCart.save();
            }

            res.status(200).json({ success: true, message: "Cart updated successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Server internal error" });
        }
    }
}


module.exports = new cartController()