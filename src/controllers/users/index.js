const UserModel = require("models/users");
const SuccessResponse = require("response");
const { UnexpectedError, InvalidInputError } = require("errors");
const logger = require("logger");

module.exports = {
  deleteUser: async (req, res, next) => {
    try {
      const deleteParam = {};

      if (!req.query?.id && !req.query?.email) {
        return next(new InvalidInputError());
      }

      if (typeof req.query?.id === "string" && req.query.id !== "") {
        // eslint-disable-next-line no-underscore-dangle
        deleteParam._id = req.query.id;
      } else {
        deleteParam.email = req.query.email;
      }

      const response = await UserModel.deleteOne(deleteParam);

      if (response.deletedCount === 0) {
        return next(new InvalidInputError(`Invalid ${Object.keys(deleteParam)[0]}`));
      }

      return new SuccessResponse({
        data: { message: "Deleted Successfully" },
      }).send(res);
    } catch (error) {
      logger.error({
        mehod: "controller.deleteUser",
        error,
      });
      return next(new UnexpectedError());
    }
  },
};
