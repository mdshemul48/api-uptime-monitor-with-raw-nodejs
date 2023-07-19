const {
  hash,
  parseJson,
  createRandomString,
} = require("../../helpers/utilities");
const data = require("../../lib/data");

const handler = {};

handler.tokenHandler = function (requestProperties, callback) {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.includes(requestProperties.method)) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      message: "Request method not accepted.",
    });
  }
};

handler._token = {};

handler._token.post = function (requestProperties, callback) {
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

  if (phone && password) {
    data.read("users", phone, (err, file) => {
      const user = parseJson(file);
      let hashedPassword = hash(password);

      if (user.password === hashedPassword) {
        const token = createRandomString(20);
        const expires = Date.now() + 60 * 60 * 1000;
        const tokenObject = {
          phone: user.phone,
          id: token,
          expires,
        };

        data.create("token", token, tokenObject, (err) => {
          if (!err) {
            callback(200, tokenObject);
          } else {
            callback(500, {
              message: "server problem while saving.",
            });
          }
        });
      } else {
        callback(404, {
          message: "password not matched.",
        });
      }
    });
  }
};

handler._token.get = function (requestProperties, callback) {};

handler._token.put = function (requestProperties, callback) {};

handler._token.delete = function (requestProperties, callback) {};

module.exports = handler;
