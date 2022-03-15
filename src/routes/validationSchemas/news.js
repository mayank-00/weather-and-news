const Joi = require("joi");

module.exports = {
  news: Joi.object({
    search: Joi.string(),
  }),
};
