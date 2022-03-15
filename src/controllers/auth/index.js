const passport = require("passport");
const jwt = require("jsonwebtoken");

const logger = require("logger");
const { jwtSecret } = require("config");
const SuccessResponse = require("response");
const { UnexpectedError, UserNotFoundError, BadCredentialsError, InvalidInputError } = require("errors");

module.exports = {
  signup: (req, res, next) => {
    passport.authenticate("signup", { session: false }, (err) => {
      try {
        if (err && err === "duplicate_email") {
          throw new InvalidInputError("Email id already exists");
        }
        new SuccessResponse({
          statusCode: 201,
          data: { message: "Signup successful" },
        }).send(res);
      } catch (error) {
        logger.error({
          method: "controller.passport.signup",
          message: error,
        });
        next(error);
      }
    })(req, res, next);
  },

  login: async (req, res, next) => {
    passport.authenticate("login", (err, user, info) => {
      try {
        if (err) {
          throw new UnexpectedError();
        }

        if (!user && info.message === "user_not_found") {
          throw new UserNotFoundError();
        }

        if (!user && info.message === "invalid_password") {
          throw new BadCredentialsError();
        }

        req.login(user, { session: false }, (error) => {
          if (error) throw new UnexpectedError();

          const { _id: id, email } = user;
          const body = { _id: id, email };
          const token = jwt.sign({ user: body }, jwtSecret);

          return new SuccessResponse({
            data: { token, message: "Login successful" },
          }).send(res);
        });
      } catch (error) {
        logger.error({
          method: "controller.passport.login",
          message: error,
        });
        next(error);
      }
    })(req, res, next);
  },
};
