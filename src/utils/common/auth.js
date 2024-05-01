const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ServerConfig } = require("../../config");
const serverConfig = require("../../config/server-config");

function checkPassword(plainPassword, hashedPassword) {
  try {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  } catch (error) {
    throw error;
  }
}

function generateToken(input) {
  try {
    return jwt.sign(input, ServerConfig.JWT_SECRET, {
      expiresIn: serverConfig.JWT_EXPIRY,
    });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  checkPassword,
  generateToken,
};
