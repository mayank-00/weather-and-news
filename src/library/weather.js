const request = require("request-promise");

const { UnexpectedError } = require("errors");

const logger = require("logger");
const redisClient = require("./redis");

class WeatherClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.openweathermap.org";
    this.location = {
      city: "Indore",
      lat: 22.7196,
      lon: 75.8577,
    };
    this.unit = "metric";
    this.count = 5;
    this.cacheKey = "weather";
  }

  async getWeatherForecast() {
    try {
      const queryParams = {
        lat: this.location.lat,
        lon: this.location.lon,
        appid: this.apiKey,
        exclude: "hourly,current,minutely,alerts",
        units: this.unit,
      };

      let cachedData = await redisClient.get(this.cacheKey);
      cachedData = JSON.parse(cachedData);

      if (cachedData != null && cachedData.lastCopy === new Date().toDateString()) {
        return Promise.resolve({ ...cachedData.data });
      }

      const response = await request({
        url: `${this.baseUrl}/data/2.5/onecall`,
        json: true,
        qs: queryParams,
      });

      const retData = {
        count: this.count,
        location: this.location.city,
        unit: this.unit,
      };

      retData.data = response.daily.slice(1, this.count + 1).map((obj) => {
        let temp = (obj.temp.min + obj.temp.max) / 2;
        temp = temp.toFixed(2);
        temp = parseFloat(temp);

        return {
          date: new Date(obj.dt * 1000).toDateString(),
          main: obj.weather[0]?.main,
          temp,
        };
      });

      redisClient.set(
        "weather",
        JSON.stringify({
          lastCopy: new Date().toDateString(),
          data: retData,
        })
      );

      return Promise.resolve(retData);
    } catch (error) {
      logger.error({
        method: "newsLib.getWeatherForecast",
        message: error,
      });

      return Promise.reject(new UnexpectedError());
    }
  }
}

module.exports = WeatherClient;
