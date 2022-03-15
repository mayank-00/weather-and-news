require("module-alias/register");
const { port } = require("config");
const logger = require("logger");
const app = require("./app");

app
  .listen(port, () => {
    logger.info({
      method: "app.listen",
      message: `Listening on port: ${port}`,
    });
  })
  .on("error", (e) => logger.error(e));

module.exports = app;
