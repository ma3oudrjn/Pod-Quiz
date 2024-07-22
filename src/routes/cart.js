const express = require('express');
const app = express();

const validator = require('../middleware/validator')
const webController = require('../controllers/web/cart')
const isAuth = require('../middleware/isAuth')
const roleValidation = require('../middleware/roleValidation')

app.post('/',
    isAuth,
    roleValidation(["business","customer"]),
    validator.validateCart,
    webController.updateOrCreateCart)



module.exports = app