const router = require("express").Router();

const controllers = require("controllers/weather");

/**
 * @swagger
 * components:
 *   schemas:
 *     WeatherObj:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           description: Forecaste's date.
 *           example: Wed Mar 16 2022
 *         main:
 *           type: string
 *           description: main type of weather.
 *           example: Clouds
 *         temp:
 *           type: number
 *           description: average temperature of this day.
 *           example: 31.6
 */

/**
 * @swagger
 * /weather:
 *  get:
 *    summary: Fetch weather forecaste for next 5 days.
 *    tags:
 *      - weather
 *    responses:
 *      '200':
 *        description: ok
 *        schema:
 *          type: object
 *          properties:
 *            count:
 *              type: number
 *              description: returned forecaste days count which is 5
 *            location:
 *              type: string
 *              description: weather forecaste for Indore location.
 *            unit:
 *              type: string
 *              description: unit for temperature. by default metric (celcius).
 *            data:
 *              type: array
 *              items:
 *                $ref: "#components/schemas/WeatherObj"
 *      '500':
 *        description: Unexpected error occurs.
 */

router.get("/", controllers.getWeather);

module.exports = router;
