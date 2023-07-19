const crypto = require("crypto");
const environments = require("./environments");

const utilities = {};

utilities.parseJson = function (jsonString) {
  let output = {};
  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }
  return output;
};

utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    let hash = crypto
      .createHmac("sha256", environments.secretKey)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

// create random string
utilities.createRandomString = (strLength) => {
  const length =
    typeof strLength === "number" && strLength > 0 ? strLength : false;
  if (length) {
    const possibleChars = "abcdefghijklmnopqrstwxyz1234567890";
    let output = "";
    for (let i = 1; i < length; i++) {
      const randomChar = possibleChars.charAt(
        Math.random() * Math.floor(possibleChars.length)
      );
      output += randomChar;
    }
    return output;
  } else {
    return false;
  }
};

module.exports = utilities;
