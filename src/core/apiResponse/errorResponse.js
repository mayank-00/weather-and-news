const { getReasonPhrase } = require("http-status-codes");

const APIResponse = require("./apiResponse");

class ErrorResponse extends APIResponse {
  constructor({ statusCode, errorMessage }) {
    super({
      statusCode,
      json: {
        error: {
          errorType: getReasonPhrase(statusCode),
          errorMessage,
        },
        data: null,
      },
    });
  }

  send(res) {
    super.send(res);
  }
}

module.exports = ErrorResponse;
