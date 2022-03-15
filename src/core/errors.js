/* eslint-disable max-classes-per-file */
const { getReasonPhrase, StatusCodes } = require("http-status-codes");
const logger = require("logger");

const ErrorResponse = require("./apiResponse/errorResponse");

class APIError extends Error {
  constructor({ statusCode, message, log }) {
    super(getReasonPhrase(statusCode));
    this.statusCode = statusCode;
    this.message = message;

    if (log != null) {
      logger.Errorf({ message, method: log.method, user: log.user });
    }
  }

  handle(res) {
    const errorResponse = new ErrorResponse({
      statusCode: this.statusCode,
      errorMessage: this.message,
    });
    return errorResponse.send(res);
  }
}

class BadCredentialsError extends APIError {
  constructor(message = "Bad credentials", log = null) {
    super({ statusCode: StatusCodes.UNAUTHORIZED, message, log });
    this.message = message;
  }
}

class InvalidTokenError extends APIError {
  constructor(message = "Invalid token", log = null) {
    super({ statusCode: StatusCodes.UNAUTHORIZED, message, log });
    this.message = message;
  }
}

class UnexpectedError extends APIError {
  constructor(message = "Something went wrong", log = null) {
    super({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message, log });
    this.message = message;
  }
}

class InvalidInputError extends APIError {
  constructor(message = "Input data is invalid", log = null) {
    super({ statusCode: StatusCodes.BAD_REQUEST, message, log });
    this.message = message;
  }
}

class BadRequestError extends APIError {
  constructor(message = "Bad request", log = null) {
    super({ statusCode: StatusCodes.BAD_REQUEST, message, log });
    this.message = message;
  }
}

class UnauthorizedError extends APIError {
  constructor(message = "Unauthorized Access", log = null) {
    super({ statusCode: StatusCodes.UNAUTHORIZED, message, log });
    this.message = message;
  }
}

class UserNotFoundError extends APIError {
  constructor(message = "User not found", log = null) {
    super({ statusCode: StatusCodes.NOT_FOUND, message, log });
    this.message = message;
  }
}

class ForbiddenError extends APIError {
  constructor(message = "Forbidden", log = null) {
    super({ statusCode: StatusCodes.FORBIDDEN, message, log });
    this.message = message;
  }
}

module.exports = {
  APIError,
  BadCredentialsError,
  InvalidTokenError,
  UnexpectedError,
  InvalidInputError,
  UnauthorizedError,
  UserNotFoundError,
  ForbiddenError,
  BadRequestError,
};
