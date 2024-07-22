const verifyJwt = require("../utils/verifyJwt")

module.exports = async (req, res, next) => {
    try {
        const header = req.headers["x-access-token"]

        const accessToken = header.split("Bearer ").pop()

        const {_id: accountId, role} = await verifyJwt(accessToken)

        req.accountInfo = {accountId, role}

        next()
    } catch (err) {
        res.sendStatus(401)
    }
}
