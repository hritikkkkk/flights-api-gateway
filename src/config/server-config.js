const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY,
  FLIGHT_SERVER: process.env.FLIGHT_SERVER,
  BOOKING_SERVER: process.env.BOOKING_SERVER,
};
