const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

const signAuthToken = (developerId) =>
  jwt.sign({ developerId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const verifyAuthToken = (token) => jwt.verify(token, env.jwtSecret);

module.exports = { signAuthToken, verifyAuthToken };
