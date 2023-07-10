class Handler {
  static sampleHandler(requestProperties, callback) {
    console.log("this is going to be really");
    callback(200, { message: "this is the simple" });
  }
}

module.exports = Handler;
