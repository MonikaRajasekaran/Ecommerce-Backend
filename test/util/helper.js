/**
 * This file consists of helper functions that are needed for test purposes.
 *
 * @author Felicia Amy.
 * @since  16/6/2019
 */

const Cryptr = require("cryptr");
const jwt = require("jsonwebtoken");

/**
 * This function will generate Access Token using jwt.
 *
 * @requires jwt
 * @param {object} object that is used for signing the token.
 * @return {string} access token.
 */
const generateAccessToken = (payload) => {
  const token = jwt.sign(payload, process.env.access_token_secret_key, {
    expiresIn: "15m",
  });
  return token;
};

/**
 * This function will generate Refresh Token using jwt.
 *
 * @requires jwt
 * @param payload {object} object that is used for signing the token.
 * @return {string} refresh token.
 */
const generateRefreshToken = (payload) => {
  const token = jwt.sign(payload, process.env.refresh_token_secret_key, {
    expiresIn: "30 days",
  });
  return token;
};

/**
 * This function will encrypt data (to replace ETS).
 *
 * @requires cryptr
 * @param strArr {Array.<String>} Array for the strings that need to be encrypted.
 * @param secretCode {String} Secret key to encrypt string.
 * @return {Array.<String>} An array of encrypted values.
 */
const simpleEncrypt = (strArr, secretCode) => {
  const cryptr = new Cryptr(secretCode);
  const encrypted = [];
  strArr.forEach((str) => {
    encrypted.push(cryptr.encrypt(str));
  });
  return encrypted;
};

/**
 * This function will decrypt data (to replace ETS).
 *
 * @requires cryptr
 * @param strArr {Array.<String>} Array for the strings that need to be decrypted.
 * @param secretCode {String} Secret key to decrypt string.
 * @return {Array.<String>} An array of decrypted values.
 */
const simpleDecrypt = (strArr, secretCode) => {
  const cryptr = new Cryptr(secretCode);
  const decrypted = [];
  strArr.forEach((str) => {
    decrypted.push(cryptr.decrypt(str));
  });
  return decrypted;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  simpleDecrypt,
  simpleEncrypt,
};
