const dotenv = require("dotenv");

function getEnvironmentVarialbes() {
  const result = dotenv.config();

  let pEnv = {};

  if ("error" in result) {
    // heroku environment
    pEnv = process.env;
  } else {
    // local environment
    pEnv = result.parsed;
  }

  return {
    db: {
      user: pEnv.DB_USER,
      password: pEnv.DB_PASSWORD,
      cluster: pEnv.DB_CLUSTER,
      name: pEnv.DB_NAME,
    },
    port: pEnv.PORT,
    jwtSecret: pEnv.JWT_AUTHTOKEN_SECRET,
    bodyParser: {
      limit: pEnv.BODY_PARSER_LIMIT,
      parameterLimit: pEnv.BODY_PARSER_PARAMETER_LIMIT,
    },
    logDirectoryPath: pEnv.LOG_DIRECTORY_PATH,
    newsAPIKey: pEnv.NEWS_API_KEY,
    openWeatherMapAPIKey: pEnv.OPEN_WEATHER_MAP_API_KEY,
    swagger: {
      schemes: [pEnv.SCHEME],
      host: `${pEnv.HOST}:${pEnv.PORT}`,
      basePath: pEnv.BASE_PATH,
    },
    basePath: pEnv.BASE_PATH,
  };
}

module.exports = getEnvironmentVarialbes();
