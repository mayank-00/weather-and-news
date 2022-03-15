const express = require("express");

const jwtAuthentication = require("middlewares/jwtAuthentication");
const controllers = require("controllers/users");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User's unique id.
 *           example: 1
 *         firstName:
 *           type: string
 *           description: User's first name.
 *           example: mayank
 *         lastName:
 *           type: string
 *           description: User's last name.
 *           example: jaiswal
 *         email:
 *           type: string
 *           description: User's email.
 *           example: jaiswal.mayank1412@gmail.com
 */

/**
 * @swagger
 * /users:
 *  delete:
 *    summary: delete user by id or email
 *    tags:
 *      - users
 *    security:
 *      - jwt: []
 *      - AuthSecurity: []
 *    parameters:
 *      - in: query
 *        name: id
 *        required: false
 *        description: id of user to delete. Field is required when email not present.
 *        schema:
 *          type: string
 *      - in: query
 *        name: email
 *        required: false
 *        description: email of user to delete. Field is required when id not present.
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: User got deleted successfully
 *      '400':
 *        description: Invalid input. id or email must be present and valid.
 *      '403':
 *        description: Unauthorized, check your token.
 *      '500':
 *        description: Unexpected error occurs.
 */

router.delete("/", jwtAuthentication, controllers.deleteUser);

module.exports = router;
