const { UnexpectedError } = require("errors");
const WeatherClient = require("library/weather");
const { openWeatherMapAPIKey: apiKey } = require("config");
const SuccessResponse = require("response");
const logger = require("logger");

module.exports = {
  getWeather: async (req, res, next) => {
    try {
      const client = new WeatherClient(apiKey);

      const response = await client.getWeatherForecast();
      return new SuccessResponse({ data: response }).send(res);
    } catch (error) {
      logger.error({
        method: "controller.getWeather",
        error,
      });
      return next(new UnexpectedError());
    }
  },
};
