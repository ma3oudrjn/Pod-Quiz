const authRedis = require("./authRedis")

module.exports = async (accountId, refreshToken) => {
  const json = await authRedis.redisClient.get(accountId)

  const accountRefreshTokens = JSON.parse(json || "[]")

  accountRefreshTokens.push(refreshToken)

  await authRedis.redisClient.set(
    accountId,
    JSON.stringify(accountRefreshTokens)
  )
}
