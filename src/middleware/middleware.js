const express = require('express')
const router = require('express').Router()
router.use(express.json());

const account = require('../routes/account')
const restaurant = require('../routes/restaurant')
const menuItem = require('../routes/menuItem')
const cart = require('../routes/cart')
router.use('/api/account', account)
router.use('/api/restaurant', restaurant)
router.use('/api/menuItem',menuItem)
router.use('/api/cart',cart)



const cors = require('cors');
router.use(cors({
    origin: ('*'),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Auth-Token', 'x-auth-token', 'Access-Control-Allow-Origin', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials: true
}))
module.exports = router
