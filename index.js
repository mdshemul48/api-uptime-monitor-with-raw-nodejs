const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environments = require("./helpers/environments");

class App {
  config = { PORT: 3000 };

  createServer() {
    const server = http.createServer(handleReqRes);
    server.listen(environments.port, () => {
      console.log(
        `${environments.envName}:- listening to port http://localhost:${environments.port}`
      );
    });
  }
}

const app = new App();
app.createServer();
