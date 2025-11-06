const AWS = require("aws-sdk");
const config = require("../../../config/config");
const decrypter = require("../../helpers/decrypter.helper");

async function initAWS() {
  AWS.config.update({
    accessKeyId: await decrypter.decrypt(config.extras.aws.accessKeyId),
    secretAccessKey: await decrypter.decrypt(config.extras.aws.secretAccessKey),
    region: "ap-southeast-1",
  });
  return new AWS.Rekognition();
}
module.exports.createCollection = (collection) =>
  new Promise(async (resolve, reject) => {
    const rekognition = await initAWS();
    rekognition.createCollection(collection, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });

module.exports.registerFace = (payload, userId) =>
  new Promise(async (resolve, reject) => {
    const rekognition = await initAWS();
    if ("Location" in payload && payload.Location) {
      rekognition.indexFaces(
        {
          CollectionId: config.extras.rekognition.collection,
          ExternalImageId: userId.toString(),
          Image: {
            S3Object: {
              Bucket: config.extras.aws.bucket,
              Name: payload.key.replace(/\+/g, " "),
            },
          },
        },
        (err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        }
      );
    }
  });

module.exports.compareFace = (imageBuffer) =>
  new Promise(async (resolve, reject) => {
    const rekognition = await initAWS();
    const params = {
      CollectionId: config.extras.rekognition.collection,
      Image: {
        // eslint-disable-next-line no-buffer-constructor
        Bytes: new Buffer(imageBuffer, "base64"),
      },
      FaceMatchThreshold: 90,
      MaxFaces: 1, // We only need the face with the most resemblance
    };
    rekognition.searchFacesByImage(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });

module.exports.deleteFaces = (faceIds) =>
  new Promise(async (resolve, reject) => {
    const rekognition = await initAWS();
    rekognition.deleteFaces(
      {
        CollectionId: config.extras.rekognition.collection,
        FaceIds: faceIds,
      },
      (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      }
    );
  });
