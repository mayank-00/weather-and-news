const express = require("express");

const router = express.Router();

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const fs = require("fs");
const path = require("path");

const config = require("config").swagger;
const logger = require("logger");

const directoryPath = path.join(__dirname, "../routes/apis");
const pathes = [];

const filesName = fs.readdirSync(directoryPath, (err, files) => {
  // handling error
  if (err) {
    logger.error({
      method: "fs.readdirSync",
      error: err,
    });
    return;
  }
  // listing all files using forEach
  // eslint-disable-next-line consistent-return
  return files.forEach((file) => {
    pathes.push(file);
  });
});

function getFullPathes(names) {
  names.forEach((name) => {
    if (name !== "index.js") {
      pathes.push(`./src/routes/apis/${name}`);
    }
  });
}

getFullPathes(filesName);

const options = {
  swaggerDefinition: {
    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          in: "header",
          bearerFormat: "JWT",
        },
      },
    },
    info: {
      title: "Weather And News App",
      version: "1.0.0",
      description: "Weather And News App System,REST API with Swagger doc",
      contact: {
        email: "jaiswal.mayank1412@gmail.com",
      },
    },
    tags: [
      {
        name: "auth",
        description: "Authentication related apis",
      },
      {
        name: "users",
        description: "Users apis",
      },
      {
        name: "weather",
        description: "Weather apis",
      },
      {
        name: "news",
        description: "News API",
      },
    ],
    securityDefinitions: {
      AuthSecurity: {
        type: "apiKey",
        in: "header",
        name: "authorization",
        description: "Bearer token required",
      },
    },
    ...config,
  },

  apis: pathes,
};
const swaggerSpec = swaggerJSDoc(options);

router.get("/json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

router.use(`${config.basePath}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = {
  router,
};
