const { createLogger, format, transports } = require("winston");
const path = require("path");
const { logDirectoryPath } = require("config");

const { combine, timestamp, printf } = format;
const actualLogDirectoryPath = path.join(logDirectoryPath);

// create logging message format
const createFormat = printf(({ level, message, method, timestamp: time, user }) => {
  const formattedTime = new Date(time).toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  return `"Method": "${method}", "Level": "${level}", "Message": "${message}", "Time": "${formattedTime}", "User": "${user}"`;
});

// create logger
const logger = createLogger({
  format: combine(timestamp(), createFormat),
  transports: [
    new transports.File({
      filename: `${actualLogDirectoryPath}/complete.log`,
      level: "silly",
    }),
    new transports.File({
      filename: `${actualLogDirectoryPath}/errors.log`,
      level: "error",
    }),
  ],
});

module.exports = logger;
