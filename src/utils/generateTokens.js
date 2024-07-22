const jwt = require("jsonwebtoken")
const fs = require("fs")
const path = require("path")
require("dotenv").config()

const privateKey = fs.readFileSync(
  path.join(__dirname, "../keys/privateKey.key"),
  "utf8"
)

module.exports = (accountId, role) => {
  const accessToken = jwt.sign(
    {
      _id: accountId,
      role
    },
    privateKey,
    {
      algorithm: "RS256",
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION
    }
  )

  const refreshToken = jwt.sign(
    {
      _id: accountId,
      role
    },
    privateKey,
    {
      algorithm: "RS256",
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION
    }
  )

  return { accessToken, refreshToken }
}