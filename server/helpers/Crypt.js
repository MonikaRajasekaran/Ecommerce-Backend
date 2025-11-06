const crypto = require("crypto");
const config = require("../../config/config");
const decrypter = require("../helpers/decrypter.helper");

const algorithm = "aes-256-gcm";

// encrypt/decrypt functions
module.exports.encrypt = (text, isDynamic = true) => {
  let iv;
  let salt;
  let key;
  const masterkey = decrypter.decrypt(config.extras.key);
  if (isDynamic) {
    // random initialization vector
    iv = crypto.randomBytes(16);
    // random salt
    salt = crypto.randomBytes(64);
    // derive encryption key: 32 byte key length
    // in assumption the masterkey is a cryptographic and NOT a password there is no need for
    // a large number of iterations. It may can replaced by HKDF
    // the value of 2145 is randomly chosen!
    key = crypto.pbkdf2Sync(masterkey, salt, 2145, 32, "sha512");
  } else {
    // random initialization vector
    const beforeBuf = decrypter.decrypt(config.extras.ivString);
    iv = Buffer.from(beforeBuf, "utf8");
    key = masterkey;
  }

  // AES 256 GCM Mode
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  // encrypt the given text
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  // extract the auth tag
  const tag = cipher.getAuthTag();
  // generate output
  if (isDynamic) {
    return Buffer.concat([salt, iv, tag, encrypted]).toString("base64");
  }
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
};

module.exports.decrypt = async (
  encdata,
  isDynamic = true,
  reference = null
) => {
  // base64 decoding
  const masterkey = decrypter.decrypt(config.extras.key);
  const bData = Buffer.from(encdata, "base64");
  let key;
  // convert data to buffers
  let salt;
  let iv;
  let tag;
  let text;

  // derive key using; 32 byte key length
  if (isDynamic) {
    salt = bData.slice(0, 64);
    iv = bData.slice(64, 80);
    tag = bData.slice(80, 96);
    text = bData.slice(96);
    key = crypto.pbkdf2Sync(masterkey, salt, 2145, 32, "sha512");
  } else {
    iv = bData.slice(0, 16);
    tag = bData.slice(16, 32);
    text = bData.slice(32);
    key = masterkey;
  }

  // AES 256 GCM Mode
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  // encrypt the given text
  const decrypted =
    decipher.update(text, "binary", "utf8") + decipher.final("utf8");

  if (reference != null) {
    const result = { reference, value: decrypted };
    return result;
  }
  return decrypted;
};
