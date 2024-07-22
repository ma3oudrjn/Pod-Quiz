const redis = require("redis")
require("dotenv").config()

const redisClient =
	redis.createClient({
		url: `${process.env.REDIS_ACCOUNT_URI}:${process.env.REDIS_ACCOUNT_PORT}`
	})

redisClient.on("connect", () =>
	console.log(`Auth redis is running at port: ${process.env.REDIS_ACCOUNT_PORT}`)
)

redisClient.on("error", (err) => console.log("Redis Error", err))

const redisConnect = async () => {
	await redisClient.connect()
}

module.exports = {
	redisClient,
	redisConnect
}
