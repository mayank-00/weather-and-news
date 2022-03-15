const routes = require("express").Router();

const config = require("config");

routes.use(config.basePath, require("./apis"));

module.exports = routes;
