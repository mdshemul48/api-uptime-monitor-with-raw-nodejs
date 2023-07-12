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

handler._users.post = function (requestProperties, callback) {};

handler._users.get = function (requestProperties, callback) {};

handler._users.put = function (requestProperties, callback) {};

handler._users.delete = function (requestProperties, callback) {};

module.exports = handler;
