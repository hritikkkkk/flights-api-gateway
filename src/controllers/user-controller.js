const { StatusCodes } = require("http-status-codes");
const { userService } = require("../services");
const { ErrorResponse, SuccessResponse } = require("../utils/common");

const userSignup = async (req, res) => {
  try {
    const response = await userService.userSignup({
      email: req.body.email,
      password: req.body.password,
    });

    SuccessResponse.data = response;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
};

module.exports = {
  userSignup,
};
