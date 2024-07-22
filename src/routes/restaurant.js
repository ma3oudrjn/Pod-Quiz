const express = require('express');
const app = express();

const validator = require('../middleware/validator')
const controller = require('../controllers/manage/restaurant')
const webController = require('../controllers/web/restaurant')
const isAuth = require('../middleware/isAuth')
const roleValidation = require('../middleware/roleValidation')

app.post('/',
    isAuth,
    roleValidation(["business"]),
    controller.postNewRestaurant,
)

    .put('/',
        isAuth,
        roleValidation(["business"]),
        validator.isOwnerOfRestaurant,
        controller.updateRestaurant
    )

    .delete('/',
        isAuth,
        roleValidation(["business"]),
        validator.isOwnerOfRestaurant,
        controller.deleteRestaurant
    )

    .get('/:id',
        webController.getRestaurantByid
    )
    .get('/get/city',
webController.getRestaurantByCity
)



module.exports = app