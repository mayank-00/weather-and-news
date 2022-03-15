class APIResponse {
  constructor({ statusCode = "", json = {} }) {
    this.statusCode = statusCode;
    this.json = json;
  }

  send(res) {
    return res.status(this.statusCode).json(this.json);
  }
}

module.exports = APIResponse;
