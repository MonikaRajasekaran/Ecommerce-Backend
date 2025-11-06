const _ = require("lodash");
const maskdata = require("maskdata");
const CONSTANTS = require("../helpers/Constants");
const mask = require("../helpers/mask.helper");

const maskEmailOptions = {
  // Character to mask the data. Default value is '*'
  maskWith: "*",
  // If the starting 'n' characters needs to be unmasked. Default value is 3
  unmaskedStartCharacters: 1, // Should be positive Integer
  // If the ending 'n' characters needs to be unmasked. Default value is 2
  unmaskedEndCharacters: 2, // Should be positive Integer
  // If '@' needs to be masked. Default value is false(Will not mask)
  maskAtTheRate: false, // Should be boolean
  // To limit the *s in the response(Max *s before '@'). Default value is 10
  maxMaskedCharactersBeforeAtTheRate: 10, // Should be positive Integer
  // To limit the *s in the response(Max *s after '@'). Default value is 10
  maxMaskedCharactersAfterAtTheRate: 10, // Should be positive Integer
};

const maskPasswordOptions = {
  maskWith: "X",
  maxMaskedCharacters: 20, // To limit the output String length to 20.
  unmaskedStartCharacters: 4,
  unmaskedEndCharacters: 9, // As last 9 characters of the secret key is a meta info which can be printed for debugging or other purpose
};
module.exports.maskResponse = (flag, response) => {
  _.map(response, (value) => {
    const obj = value;
    if (obj.user) {
      const data = { ...obj.user };
      const omitted = _.omit(data, [
        "_id",
        "platfrom",
        "isPBKDF2",
        "passwordLastReset",
        "isVerified",
        "isActive",
        "createdAt",
        "updatedAt",
        "salt",
        "hashedPassword",
      ]);
      if (flag) {
        omitted.firstName = mask.string(omitted.firstName, { percentage: 90 });
        omitted.lastName = mask.string(omitted.lastName, { percentage: 90 });
        omitted.email = maskdata.maskEmail2(omitted.email, maskEmailOptions);
        omitted.username = mask.string(omitted.username, { percentage: 80 });
      }
      obj.user = omitted;
      return obj;
    }
  });
  return response;
};

module.exports.removeConfidential = (user, response) => {
  _.map(response, (value) => {
    const obj = value;

    const data = { ...obj.user };
    const omitted = _.omit(data, [
      "_id",
      "platfrom",
      "isPBKDF2",
      "passwordLastReset",
      "isVerified",
      "isActive",
      "createdAt",
      "updatedAt",
      "salt",
      "hashedPassword",
    ]);
    if (user) {
      obj.user = omitted;
    } else {
      delete obj.user;
    }
    return obj;
  });
  return response;
};
