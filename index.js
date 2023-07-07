const http = require("http");

const app = {};

app.config = {
  PORT: 3000,
};

app.createServer = function () {
  const server = http.createServer(this.handleReqRes);

  server.listen(this.config.PORT, () => {
    console.log(`listening to port http://localhost:${this.config.PORT}`);
  });
};

app.handleReqRes = (req, res) => {
  res.end("hello world");
};

app.createServer();
