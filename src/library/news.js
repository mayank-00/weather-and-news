/* eslint-disable class-methods-use-this */
const NewsAPI = require("newsapi");

const logger = require("logger");
const { UnexpectedError } = require("errors");
const redisClient = require("./redis");

class NewsClient {
  constructor(apiKey) {
    this.newsapi = new NewsAPI(apiKey);
    this.pageSize = 100;
    this.page = 1;
  }

  async getNews({ search = "" }) {
    try {
      let cacheKeyAppend = "top-headline";

      const cachedHeadlineData = await this.getCachedData(search, cacheKeyAppend);

      if (cachedHeadlineData != null) {
        return Promise.resolve(cachedHeadlineData);
      }

      const { page, pageSize } = this;

      let response = await this.newsapi.v2.topHeadlines({
        q: search,
        language: "en",
        pageSize,
        page,
      });

      if (search !== "" && response.totalResults === 0) {
        cacheKeyAppend = "everything";

        const cachedEverythingData = await this.getCachedData(search, cacheKeyAppend);

        if (cachedEverythingData != null) {
          return Promise.resolve(cachedEverythingData);
        }

        response = await this.newsapi.v2.everything({
          q: search,
          language: "en",
          page,
          pageSize,
        });
      }

      const retData = {};
      retData.data = response.articles.map((article) => ({
        headline: article.title,
        link: article.url,
        publishedAt: new Date(article.publishedAt).toDateString(),
      }));
      retData.count = retData.data.length;

      setTimeout(() => {
        this.addDataToCache(retData, search, cacheKeyAppend);
      }, 0);

      return Promise.resolve(retData);
    } catch (error) {
      logger.error({
        method: "newsLib.getNews",
        message: error,
      });
      return Promise.reject(new UnexpectedError());
    }
  }

  getCachedData(search, cacheKeyAppend) {
    return new Promise((resolve) => {
      let key = "";

      if (search === "") {
        key = `no_search_query___${cacheKeyAppend}`;
      } else {
        key = `${search}___${cacheKeyAppend}`;
      }

      redisClient
        .get(key)
        .then((cachedData) => JSON.parse(cachedData))
        .then((cachedData) => {
          if (cachedData === null) return resolve(null);
          const diffTime = Math.abs(Date.now() - cachedData.lastCopy);
          const diffMinutes = Math.ceil(diffTime / 60000);

          if (diffMinutes < 60) {
            return resolve({
              count: cachedData.count,
              data: cachedData.data,
            });
          }
          return resolve(null);
        })
        .catch((error) => {
          logger.error({
            method: "newsLib.getCachedData",
            message: error,
          });
          return resolve(null);
        });
    });
  }

  async addDataToCache(data, search, cacheKeyAppend) {
    let key = "";

    if (search !== "") {
      key = `${search}___${cacheKeyAppend}`;
    } else {
      key = `no_search_query___${cacheKeyAppend}`;
    }

    try {
      await redisClient.set(
        key,
        JSON.stringify({
          ...data,
          lastCopy: Date.now(),
        })
      );
    } catch (error) {
      logger.error({
        method: "newsLib.addDataToCache",
        message: error,
      });
    }
  }
}

module.exports = NewsClient;
