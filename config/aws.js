const AWS = require("aws-sdk");
const config = require("../config/config");

const decrypter = require("../server/helpers/decrypter.helper");

module.exports = () => async (req, res, next) => {
  try {
    AWS.config.update({
      correctClockSkew: true,
      accessKeyId: decrypter.decrypt(config.extras.aws.accessKeyId),
      secretAccessKey: decrypter.decrypt(config.extras.aws.secretAccessKey),
      region: "ap-southeast-1",
    });
    req.cognitoClient = new AWS.CognitoIdentityServiceProvider({
      apiVersion: "2022-10-03",
      region: "ap-southeast-1"
    });
    req.S3 = new AWS.S3();
    req.Rekognition = new AWS.Rekognition();
    return next();
  } catch (e) {
    req.s3 = null;
    req.Rekognition = null;
    return next();
  }
};
