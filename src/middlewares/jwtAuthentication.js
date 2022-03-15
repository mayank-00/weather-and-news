const passport = require("passport");

const { InvalidTokenError, APIError } = require("errors");

const jwtAuthentication = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error) => {
    if (error && error instanceof APIError) {
      return next(error);
    }

    if (error) {
      return next(new InvalidTokenError());
    }

    return next();
  })(req, res, next);
};

module.exports = jwtAuthentication;
