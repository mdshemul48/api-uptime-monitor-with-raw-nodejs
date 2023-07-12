const { hash } = require("../../helpers/utilities");
const data = require("../../lib/data");

const handler = {};

handler.userHandler = function (requestProperties, callback) {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.includes(requestProperties.method)) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      message: "Request method not accepted.",
    });
  }
};

handler._users = {};

handler._users.post = function (requestProperties, callback) {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length == 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;
  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean"
      ? requestProperties.body.tosAgreement
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    // check if user already exist.
    data.read("users", phone, (err, result) => {
      if (err) {
        let userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };

        data.create("users", phone, userObject, (err) => {
          if (!err) {
            callback(200, {
              message: "User was created successfully!",
            });
          } else {
            callback(500, { message: "Could not create user!" });
          }
        });
      } else {
        callback(500, {
          message: "There was a problem in server side!",
        });
      }
    });
  } else {
    callback(400, {
      message: "There is a problem in your request.",
    });
  }
};

handler._users.get = function (requestProperties, callback) {};

handler._users.put = function (requestProperties, callback) {};

handler._users.delete = function (requestProperties, callback) {};

module.exports = handler;
