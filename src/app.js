const express = require("express");

const path = require("path");
const bodyParser = require("body-parser");

require("./library/db");
require("./library/passport");
require("./library/redisServer");

const config = require("config");
const { APIError, UnexpectedError, InvalidInputError, BadRequestError } = require("errors");
const swagger = require("./library/swagger");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "25mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "25mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(require("helmet")());

app.use(require("cors")());

app.use("/", swagger.router);
app.use(require("routes"));

app.get("/", (req, res) => {
  res.redirect(`${config.basePath}/docs`);
});

// error handling ----
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof APIError) {
    return err.handle(res);
  }

  if (err?.error?.isJoi) {
    return new InvalidInputError(err.error.toString()).handle(res);
  }

  if (err?.statusCode === 400) {
    return new BadRequestError(err?.type || "").handle(res);
  }

  return new UnexpectedError().handle(res);
});

module.exports = app;
