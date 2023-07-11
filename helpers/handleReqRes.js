const url = require("url");
const { StringDecoder } = require("string_decoder");

const routes = require("../routes/routes");
const { notFoundHandler } = require("../handlers/routeHandler/notFoundHandler");

class handler {
  static handleReqRes(req, res) {
    // request handling
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    const trimmedPath = path.replace(/^\/+|\/+$/g, "");
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headerObject = req.headers;

    const decoder = new StringDecoder("utf-8");
    let realData = "";

    const requestProperties = {
      parsedUrl,
      path,
      trimmedPath,
      method,
      queryStringObject,
      headerObject,
    };

    const chosenHandler = routes[trimmedPath]
      ? routes[trimmedPath]
      : notFoundHandler;

    req.on("data", (buffer) => {
      realData += decoder.write(buffer);
    });

    req.on("end", () => {
      realData += decoder.end();

      chosenHandler(requestProperties, (statusCode, payload) => {
        statusCode = typeof statusCode === "number" ? statusCode : 500;
        payload = typeof payload === "object" ? payload : {};

        const payloadString = JSON.stringify(payload);
        res.writeHead(statusCode);
        res.end(payloadString);
      });
    });
  }
}

module.exports = handler;