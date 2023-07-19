const { hash, parseJson } = require("../../helpers/utilities");
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

handler._users.get = function (requestProperties, callback) {
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length == 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    // lookup the user
    data.read("users", phone, (err, userData) => {
      const user = { ...parseJson(userData) };
      if (!err && user) {
        delete user.password;
        callback(200, user);
      } else {
        callback(404, {
          message: "Requested user was not found.",
        });
      }
    });
  } else {
    callback(404, {
      message: "Requested user was not found.",
    });
  }
};

handler._users.put = function (requestProperties, callback) {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length == 11
      ? requestProperties.body.phone
      : false;

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

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      data.read("users", phone, (err, userStringData) => {
        const userData = { ...parseJson(userStringData) };
        if (!err && userData) {
          if (firstName) {
            userData.firstName = firstName;
          }

          if (lastName) {
            userData.lastName = lastName;
          }

          if (password) {
            userData.password = hash(password);
          }
          data.update("users", phone, userData, (err) => {
            if (!err) {
              callback(200, {
                message: "User has been updated.",
              });
            } else {
              callback(500, {
                message: "User not updated. Server Error.",
              });
            }
          });
        } else {
          callback(404, {
            message: "User not found.",
          });
        }
      });
    } else {
      callback(400, {
        message: "You have problem in your request.",
      });
    }
  } else {
    callback(400, {
      message: "invalid phone number.",
    });
  }
};

handler._users.delete = function (requestProperties, callback) {
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length == 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    data.read("users", phone, (err, userData) => {
      if (!err && userData) {
        data.delete("users", phone, (err) => {
          if (!err) {
            callback(200, { message: "User Deleted successfully." });
          } else {
            callback(500, { message: "Something went wrong with server." });
          }
        });
      }
    });
  } else {
    callback(404, {
      message: "User info not provided.",
    });
  }
};

module.exports = handler;
