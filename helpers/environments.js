const environments = {};

environments.production = {
  port: 5000,
  envName: "production",
};

environments.staging = {
  port: 3000,
  envName: "staging",
};
const currentEnvironment =
  typeof process.env.NODE_ENV === "string"
    ? process.env.NODE_ENV.trim()
    : "staging";

module.exports =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;
