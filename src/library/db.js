const mongoose = require("mongoose");
const logger = require("logger");
const { db } = require("config");

const { user, password, cluster, name: dbname } = db;

const uri = `mongodb+srv://${user}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", (error) => {
  logger.error({
    method: "mongoose.connection.on",
    message: `error: ${error}`,
  });
});

mongoose.connection.once("open", () => {
  logger.info({
    message: "Connected successfully",
    method: "mongoose.connection.once",
  });
});
