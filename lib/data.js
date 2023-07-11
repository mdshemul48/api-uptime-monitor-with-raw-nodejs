const fs = require("fs");
const path = require("path");

const lib = {};

// base directory of the data folder
lib.basedir = path.join(__dirname, "/../data");

lib.create = function (dir, file, data, callback) {
  fs.open(
    path.join(this.basedir, dir, file + ".json"),
    "wx",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        const stringData = JSON.stringify(data);

        fs.writeFile(fileDescriptor, stringData, function (err) {
          if (!err) {
            fs.close(fileDescriptor, function (err) {
              if (!err) {
                callback(false);
              } else {
                callback("Error closing file");
              }
            });
          } else {
            callback("Error writing to new file.");
          }
        });
      } else {
        callback("Could not create new file, it may already exists!");
      }
    }
  );
};

module.exports = lib;
