const express = require("express");
const validator = require("express-joi-validation").createValidator({
  passError: true,
});

const authControllers = require("controllers/auth");
const joischema = require("../validationSchemas/auth");

const router = express.Router();

/**
 * @swagger
 * /signup:
 *  post:
 *    summary: register user.
 *    tags:
 *      - auth
 *    parameters:
 *      - in: body
 *        name: user
 *        description: The user to create.
 *        schema:
 *          type: object
 *          required:
 *            - email
 *            - password
 *            - firstName
 *            - lastName
 *          properties:
 *            email:
 *              type: string
 *            password:
 *               type: string
 *            firstName:
 *              type: string
 *            lastName:
 *               type: string
 *    responses:
 *      '201':
 *        description: user got registered successfully
 *      '500':
 *        description: Unexpected error occurs.
 *      '400':
 *        description: Bad inputs or you are using existing email.
 */

router.post("/signup", validator.body(joischema.signup), authControllers.signup);

/**
 * @swagger
 * /login:
 *  post:
 *    summary: register's login and receive JSON token'.
 *    tags:
 *      - auth
 *    parameters:
 *      - in: body
 *        name: login credentials
 *        description: The user to login.
 *        schema:
 *          type: object
 *          required:
 *            - email
 *            - password
 *          properties:
 *            email:
 *              type: string
 *            password:
 *               type: string
 *    responses:
 *      '200':
 *        description: user authenticated successfully
 *        schema:
 *          type: object
 *          properties:
 *            token:
 *              type: string
 *              description: json auth token
 *      '500':
 *        description: Unexpected error occurs.
 *      '400':
 *        description: Invalid credentials.
 *      '404':
 *        description: Email or User not found.
 */

router.post("/login", validator.body(joischema.login), authControllers.login);

module.exports = router;
