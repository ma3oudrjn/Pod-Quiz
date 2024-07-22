const dotenv = require('dotenv');
const account = require("../../models/account");
const bcrypt = require("bcrypt");
const axios = require("axios");
const generateTokens = require("../../utils/generateTokens");
const saveRefreshTokenToRedis = require("../../utils/saveRefreshTokenToRedis");
dotenv.config();

class Account {

    async registerAccount(req, res) {
        const {phoneNumber, firstName, lastName, password, role} = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const otp = Math.floor(Math.random() * 90000 + 10000);

            const newAccount = new account({
                phoneNumber,
                firstName,
                lastName,
                password: hashedPassword,
                role,
                otp
            });

            await newAccount.save();

            const apiUrl = `https://api.kavenegar.com/v1/${process.env.KAVEH_NEGAR_API_KEY}/verify/lookup.json`;
            const params = {
                receptor: phoneNumber,
                token: String(otp),
                template: "OTP"
            };

            const response = await axios.get(apiUrl, {params});
            res.status(200).json({success: true, message: `${response.status}`});

        } catch (error) {
            console.error(error);
            res.status(500).json({success: false, message: "server internal error"});
        }
    }

    async verifyAccount(req, res) {
        const {otp, phoneNumber} = req.body;
        if (!otp) {
            return res.status(404).json({success: false, message: "otp not found"});
        }
        try {
            const user = await account.findOne({phoneNumber});

            if (!user) {
                return res.status(404).json({success: false, message: "user not found"});
            }

            if (user.otp === parseInt(otp, 10)) {
                user.isActive = true;
                user.otp = undefined;
                await user.save();

                const {accessToken, refreshToken} = generateTokens(user._id, user.role);
                await saveRefreshTokenToRedis(user._id.toString(), refreshToken);

                return res.status(200).json({success: true, message: "registered successfully", token: accessToken});
            } else {
                return res.status(400).json({success: false, message: "otp not verified"});
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({success: false, message: "server internal error"});
        }
    }

    async loginByPass(req, res) {
        const {phoneNumber, password} = req.body;

        try {
            const user = await account.findOne({phoneNumber}).lean();

            if (!user) {
                return res.status(404).json({success: false, message: "user not found"});
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(403).json({success: false, message: "wrong data"});
            }

            const {accessToken, refreshToken} = generateTokens(user._id, user.role);
            await saveRefreshTokenToRedis(user._id.toString(), refreshToken);

            delete user.password;


            res.json({success: true, message: {...user, accessToken, refreshToken}});

        } catch (error) {
            console.error(error);
            res.status(500).json({message: error.message});
        }
    }



}

module.exports = new Account()