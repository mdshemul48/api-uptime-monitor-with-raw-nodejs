class Handler {
  static notFoundHandler(requestProperties, callback) {
    callback(404, { message: "nothing found." });
  }
}

module.exports = Handler;
