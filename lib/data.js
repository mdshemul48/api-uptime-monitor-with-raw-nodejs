const fs = require("fs");
const path = require("path");

const lib = {};

// base directory of the data folder
lib.basedir = path.join(__dirname, "/../.data");

lib._syncDir = function (dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

lib._buildPath = function (dir, file) {
  return path.join(this.basedir, dir, file + ".json");
};

lib.create = function (dir, file, data, callback) {
  this._syncDir(path.join(this.basedir, dir));

  fs.open(this._buildPath(dir, file), "wx", function (err, fileDescriptor) {
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
  });
};

lib.read = function (dir, file, callback) {
  fs.readFile(this._buildPath(dir, file), "utf-8", callback);
};

lib.update = function (dir, file, data, callback) {
  fs.open(this._buildPath(dir, file), "r+", function (err, fileDescriptor) {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);
      fs.ftruncate(fileDescriptor, function (err) {
        if (!err) {
          fs.writeFile(fileDescriptor, stringData, function (err) {
            if (!err) {
              fs.close(fileDescriptor, function (err) {
                if (!err) {
                  callback(false);
                } else {
                  callback("Error closing file!");
                }
              });
            } else {
              callback("writing file failed.");
            }
          });
        } else {
          callback("something went wrong while updating.");
        }
      });
    } else {
      callback("something went wrong while updating file.");
    }
  });
};

lib.delete = function (dir, file, callback) {
  fs.unlink(this._buildPath(dir, file), function (err) {
    if (!err) {
      callback("something went wrong while deleting file.");
    } else {
      callback(false);
    }
  });
};
module.exports = lib;
