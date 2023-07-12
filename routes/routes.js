const { sampleHandler } = require("../handlers/routeHandler/sampleHandler");
const { userHandler } = require("../handlers/routeHandler/userHandler");

const routes = {
  sample: sampleHandler,
  users: userHandler,
};

module.exports = routes;
