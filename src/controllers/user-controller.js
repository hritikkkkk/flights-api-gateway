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
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
};

const userLogin = async (req, res) => {
  try {
    const response = await userService.userLogin({
      email: req.body.email,
      password: req.body.password,
    });
    SuccessResponse.data = response;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
};

const addRoleToUser = async (req, res) => {
  try {
    const response = await userService.addRoleToUser({
      role: req.body.role,
      id: req.body.id,
    });
    SuccessResponse.data = response;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
};

module.exports = {
  userSignup,
  userLogin,
  addRoleToUser,
};
