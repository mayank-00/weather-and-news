const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const { jwtSecret } = require("config");
const logger = require("logger");
const UserModel = require("models/users");
const { UserNotFoundError } = require("errors");

passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        await UserModel.create({
          email,
          password,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        });

        done(null);
      } catch (error) {
        if (error?.code === 11000 && typeof error?.keyPattern?.email !== "undefined") {
          done("duplicate_email");
        } else {
          logger.error({
            method: "passportLib.signup",
            message: error,
          });
          done(error);
        }
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });

        if (!user) {
          return done(null, false, { message: "user_not_found" });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: "invalid_password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        logger.error({
          method: "passportLib.login",
          message: error,
        });
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        const user = await UserModel.findOne({ email: token.user.email });

        if (!user) {
          done(new UserNotFoundError());
        } else {
          done(null);
        }
      } catch (error) {
        logger.error({
          method: "passportLib.jwtStrategy",
          message: error,
        });
        done(error);
      }
    }
  )
);
