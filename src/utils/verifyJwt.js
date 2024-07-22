const jwt = require("jsonwebtoken")
const fs = require("fs")
const path = require("path")
require("dotenv").config()

const publicKey = fs.readFileSync(
	path.join(__dirname, "../keys/publicKey.key"),
	"utf8"
)

module.exports = async (token) =>
	new Promise((resolve, reject) => {
		jwt.verify(token, publicKey, (err, decodedJwt) => {
			err && reject(err)
			resolve(decodedJwt)
		})
	})
