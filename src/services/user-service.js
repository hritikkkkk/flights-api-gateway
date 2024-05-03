const { StatusCodes } = require("http-status-codes");
const { UserRepository, RoleRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { Auth, Enums } = require("../utils/common");

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

const userSignup = async (data) => {
  try {
    const user = await userRepository.create(data);
    const role = await roleRepository.getRoleByName(
      Enums.USER_ROLES_ENUMS.CUSTOMER
    );
    user.addRole(role);
    return user;
  } catch (error) {
    if (
      error.name == "SequelizeValidationError" ||
      error.name == "SequelizeUniqueConstraintError"
    ) {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }
    throw new AppError(
      "Cannot create a new user object",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const userLogin = async (data) => {
  try {
    const user = await userRepository.getUserByEmail(data.email);
    if (!user) {
      throw new AppError(
        "No user found for the given email",
        StatusCodes.NOT_FOUND
      );
    }
    const passwordMatch = Auth.checkPassword(data.password, user.password);
    if (!passwordMatch) {
      throw new AppError("Invalid password", StatusCodes.BAD_REQUEST);
    }

    const jwt = Auth.generateToken({ id: user.id, email: user.email });
    return jwt;
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const isAuthenticated = async (token) => {
  try {
    if (!token)
      throw new AppError("missing jwt token", StatusCodes.BAD_REQUEST);
    const response = Auth.verifyToken(token);
    const user = await userRepository.get(response.id);
    if (!user) throw new AppError("no such user found", StatusCodes.NOT_FOUND);
    return user.id;
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error.name == "JsonWebTokenError")
      throw new AppError("Invalid JWT token", StatusCodes.BAD_REQUEST);
    if (error.name == "TokenExpiredError")
      throw new AppError("JWT token expired", StatusCodes.BAD_REQUEST);
    throw new AppError(
      "somehting went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const addRoleToUser = async (data) => {
  try {
    const user = await userRepository.get(data.id);
    if (!user) throw new AppError("No such user found", StatusCodes.NOT_FOUND);

    const role = await roleRepository.getRoleByName(data.role);
    if (!role)
      throw new AppError(
        "No user found for the given role",
        StatusCodes.NOT_FOUND
      );
    user.addRole(role);
    return user;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const isAdmin = async (id) => {
  try {
    const user = await userRepository.get(id);
    if (!user) throw new AppError("No such user found", StatusCodes.NOT_FOUND);
    const userIsAdmin = await roleRepository.getRoleByName(
      Enums.USER_ROLES_ENUMS.ADMIN
    );
    if (!userIsAdmin)
      throw new AppError(
        "No user found for the given role",
        StatusCodes.NOT_FOUND
      );
    return user.hasRole(userIsAdmin);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  userSignup,
  userLogin,
  isAuthenticated,
  addRoleToUser,
  isAdmin,
};
