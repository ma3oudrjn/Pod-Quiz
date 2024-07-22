const express = require('express');
const app = express();

const validator = require('../middleware/validator')
const webController = require('../controllers/web/account')
const isAuth = require('../middleware/isAuth')
const roleValidation = require('../middleware/roleValidation')

app.post('/register',
    validator.registerAccount,
    webController.registerAccount,)

    .post('/verify',
        webController.verifyAccount
    )

    .post('/login',
        webController.loginByPass
    )


module.exports = app