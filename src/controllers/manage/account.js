const accountModel = require('../../models/account')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv').config();
const saveRefreshTokenToRedis = require('../../utils/saveRefreshTokenToRedis')
const generateTokens = require('../../utils/generateTokens')


class Account {

    async newAdmin(req, res) {
        const {phoneNumber, firstName,lastName,addresses,email, password} = req.body

        try {

            const hashedPass = bcrypt.hashSync(password, 10)


            const newAccount = new account({
                phoneNumber,
                lastName,
                addresses,
                email,
                firstName,
                password: hashedPass,
                role: "admin",
                isVerify: true
            })
            await newAccount.save()
            const {accessToken, refreshToken} =
                generateTokens(newAccount._id, newAccount.role)

            await saveRefreshTokenToRedis(
                newAccount._id.toString(),
                refreshToken
            )

            return res.status(200).json({
                message: "successfully verified",
                refreshToken: refreshToken, accessToken: accessToken
            })

        } catch (error) {
            res.status(500).json({message: "server internal error"})
            console.log(error);
        }
    }

    async login(req, res) {
        const {phoneNumber, password} = req.body
        try {
            const adminAccount = await account.findOne({phoneNumber}).lean()

            if (!adminAccount) {
                return res.status(404).json({message: "admin not found"})
            }

            const result =
                await bcrypt.compareSync(
                    password,
                    adminAccount.password
                )

            if (!result) {
                return res.status(403).json({message: "wrong data"})
            }

            const {accessToken, refreshToken} =
                generateTokens(adminAccount._id, adminAccount.role)

            await saveRefreshTokenToRedis(
                adminAccount._id.toString(),
                refreshToken
            )

            delete adminAccount.password

            const response = {
                ...adminAccount,
                accessToken,
                refreshToken
            }

            res.json(response)
        } catch (err) {
            console.log(err)
            res.status(500).json({message: err.message})
        }
    }

    async adminsList(req, res) {
        const {skip = 0, limit = 10} = req.query
        try {
            const allAdmins =
                await account.find({isVerify: true})
                    .skip(parseInt(skip)).limit(parseInt(limit)).lean()

            res.status(200).json({allAdmins})
        } catch (err) {
            console.log(err)
            res.status(500).json({message: err.message})
        }
    }

    async editAdmin(req, res) {
        const {phoneNumber, name, id} = req.body
        try {
            const editedAdmin =
                await account.findByIdAndUpdate(id, {phoneNumber, name}, {new: true}).lean()

            if (!editedAdmin) {
                return res.status(404).json({message: "admin not found"})
            }
            res.status(200).json({message: `${editedAdmin.name} edited`})
        } catch (err) {
            console.log(err)
            res.status(500).json({message: err.message})
        }
    }

    async deleteAdmin(req, res) {
        const id = req.params.id
        try {
            const deletedAdmin =
                await account.findByIdAndUpdate(id, {isVerify: false}, {new: true}).lean()

            if (!deletedAdmin) {
                return res.status(200).json({message: "admin not found"})
            }

            res.status(200).json({message: `admin deleted successfully`})
        } catch (err) {
            console.log(err)
            res.status(500).json({message: err.message})
        }
    }

    async forgetPass(req, res) {
        const {phoneNumber, password} = req.body
        try {
            const editedAdmin =
                await account.findOneAndUpdate({phoneNumber}, {password: bcrypt.hashSync(password, 10)},
                    {new: true}).lean()

            if (!editedAdmin) {
                return res.status(404).json({message: "admin not found"})
            }

            res.status(200).json({message: `password changed successfully`})

        } catch (err) {
            console.log(err)
            res.status(500).json({message: err.message})
        }
    }

    async getAdminById(req, res) {
        const id = req.params.id;
        try {
            const Admin = await account.findById(id).lean()

            if (!Admin) {
                return res.status(404).json({message: "admin not found"})
            }
            res.status(200).json(Admin)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
}


module.exports = new Account()