const express = require("express");
const router = express.Router();
const { userController } = require("../../controllers");
const { AuthRequestMiddleware } = require("../../middlewares");

router.post(
  "/signup",
  AuthRequestMiddleware.validateAuthRequest,
  userController.userSignup
);

router.post(
  "/login",
  AuthRequestMiddleware.validateAuthRequest,
  userController.userLogin
);

module.exports = router;
