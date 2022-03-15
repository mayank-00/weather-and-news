const { createClient } = require("redis");

const logger = require("logger");

let client = null;

// eslint-disable-next-line consistent-return
(async () => {
  if (client != null) {
    return client;
  }
  client = createClient();

  client.on("error", (error) => {
    logger.error({
      method: "redis client",
      message: `error: ${error}`,
    });
  });

  await client.connect();
})();

module.exports = client;
