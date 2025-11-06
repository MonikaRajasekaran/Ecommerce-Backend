// server/helpers/decrypter.helper.js
const pk = require("protect-config");

module.exports.decrypt = (encryptedText) => {
  try {
    if (!encryptedText) return undefined;

    // Skip decryption if running locally or no CONFIG_PASSWORD is set
    if (
      process.env.ENV === "development" ||
      process.env.NODE_ENV === "development" ||
      !process.env.CONFIG_PASSWORD
    ) {
      return encryptedText;
    }

    // Attempt decryption only if key is available
    return pk.decrypt(encryptedText);
  } catch (err) {
    console.warn("⚠️ Decryption skipped: using plain text value instead");
    return encryptedText;
  }
};
