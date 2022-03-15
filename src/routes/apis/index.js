const routes = require("express").Router();

const auth = require("./auth");
const news = require("./news");
const weather = require("./weather");
const users = require("./users");

routes.use("/", auth);
routes.use("/news", news);
routes.use("/weather", weather);
routes.use("/users", users);

module.exports = routes;
