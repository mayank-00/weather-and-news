const Joi = require("joi");

module.exports = {
  signup: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  }),
  login: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
};
