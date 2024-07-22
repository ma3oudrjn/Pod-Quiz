const roleValidation = (roles) => {
    return (req, res, next) => {
        const {role} = req.accountInfo

        if (!roles.includes(role)) {
            return res.status(403).json({
                message: "عملیات غیر مجاز"
            })
        }
        next()
    }
}

module.exports = roleValidation
