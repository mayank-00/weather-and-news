const express = require("express");
const validator = require("express-joi-validation").createValidator({
  passError: true,
});

const jwtAuthentication = require("middlewares/jwtAuthentication");
const controllers = require("controllers/news");
const joiSchema = require("../validationSchemas/news");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     NewsArticle:
 *       type: object
 *       properties:
 *         headline:
 *           type: string
 *           description: News headline.
 *         link:
 *           type: string
 *           description: News url of actual post.
 *         publishedAt:
 *           type: string
 *           description: date when news article got published.
 */

/**
 * @swagger
 * /news:
 *  get:
 *    summary: Retrives news articles in english language topHeadlines or all news and can search by keyword.
 *    tags:
 *      - news
 *    security:
 *      - jwt: []
 *      - AuthSecurity: []
 *    parameters:
 *      - in: query
 *        name: search
 *        required: false
 *        description: keyword to search in top-headlines or content.
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: ok
 *        schema:
 *          type: object
 *          properties:
 *            count:
 *              type: number
 *            data:
 *              type: array
 *              items:
 *                $ref: "#components/schemas/NewsArticle"
 *      '500':
 *        description: Unexpected error occurs.
 *      '403':
 *        description: Unauthorized, check your token.
 */

router.get("/", jwtAuthentication, validator.query(joiSchema.news), controllers.getNews);

module.exports = router;
