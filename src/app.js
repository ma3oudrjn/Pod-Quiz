const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const swaggerDocs = require('../src/swagger/index');
const authRedis = require("../src/utils/authRedis");
const middleware = require('../src/middleware/middleware')

const app = express();

const dbName = process.env.MONGO_DB_NAME;
const port = process.env.PORT || 2020;
const host = process.env.API_SERVER_URL;

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_CONNECTION, { dbName });
        console.log('Connected to the database');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
};

const initializeRedis = () => {
    authRedis.redisConnect();
};

app.use(express.json());
app.use(middleware)
swaggerDocs(app, port, host);

const startServer = () => {
    app.listen(port, () => {
        console.log(`Server is running at port: ${port}`);
    });
};

const initializeApp = async () => {
    await connectToDatabase();
    initializeRedis();
    startServer();
};

initializeApp();
