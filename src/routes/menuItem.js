const express = require('express');
const app = express();

const validator = require('../middleware/validator')
const controller = require('../controllers/manage/menu')
const isAuth = require('../middleware/isAuth')
const roleValidation = require('../middleware/roleValidation')

app.post('/',
    isAuth,
    roleValidation(["business"]),
    validator.isOwnerOfRestaurant,
    controller.createMenuItem
)

    .put('/:id',
        isAuth,
        roleValidation(["business"]),
        validator.isOwnerOfRestaurant,
        controller.updateMenuItem
    )

    .delete('/:id',
        isAuth,
        roleValidation(["business"]),
        validator.isOwnerOfRestaurant,
        controller.deleteMenuItem
    )

    .get('/:restaurantId',
        isAuth,
        roleValidation(["business"]),
        controller.getMenuItems
    )
    .get('/:id',
        isAuth,
        roleValidation(["business"]),
        controller.getMenuItemById
    )



module.exports = app