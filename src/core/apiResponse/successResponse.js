const { StatusCodes } = require("http-status-codes");

const APIResponse = require("./apiResponse");

class SuccessResponse extends APIResponse {
  constructor({ statusCode = StatusCodes.OK, data }) {
    super({
      statusCode,
      json: {
        error: null,
        data,
      },
    });
  }

  send(res) {
    super.send(res);
  }
}

module.exports = SuccessResponse;
