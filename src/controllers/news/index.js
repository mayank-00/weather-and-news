const NewsClient = require("library/news");
const { newsAPIKey } = require("config");
const SuccessResponse = require("response");
const logger = require("logger");

const client = new NewsClient(newsAPIKey);

module.exports = {
  getNews: async (req, res, next) => {
    try {
      const response = await client.getNews({ search: req.query.search });
      return new SuccessResponse({ data: response }).send(res);
    } catch (error) {
      logger.error({
        method: "controller.getNews",
        message: error,
      });
      return next(error);
    }
  },
};
