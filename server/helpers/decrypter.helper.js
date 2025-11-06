const pk = require("protect-config");

module.exports.decrypt = (encryptedText) => {
  if (process.env.ENV !== "development") {
    const plainText = pk.decrypt(encryptedText);
    return plainText;
  }
  return encryptedText;
};
