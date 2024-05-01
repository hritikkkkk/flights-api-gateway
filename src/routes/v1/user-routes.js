const express = require("express");
const router = express.Router();
const { userController } = require("../../controllers");

router.post("/", userController.userSignup);

module.exports = router;
