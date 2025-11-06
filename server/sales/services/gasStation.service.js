const mongoose = require("mongoose");
const httpStatus = require("http-status");
const database = require("../../helpers/db.helper");
const CONSTANTS = require("../../helpers/Constants");
const APIError = require("../../helpers/APIError.helper");
require("../models/resources.model");

const Resources = mongoose.model("Resources");

module.exports.uploadToAWS = (S3, params) =>
  new Promise(async (resolve, reject) => {
    S3.upload(params, (err, data) => {
      if (err) return reject(err);
      if (data && "Location" in data) {
        return resolve(data);
      }
      return reject(
        new APIError("Missing Resource URl", httpStatus.NOT_FOUND, true)
      );
    });
  });

module.exports.saveToCollection = (payload) =>
  new Promise((resolve, reject) => {
    database
      .save(Resources, payload)
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });

module.exports.getAwsData = async (S3, bucket, key) => {
  return S3.getObject({
    Bucket: bucket,
    Key: key,
  }).createReadStream();
};

module.exports.getFileById = (query) =>
  new Promise((resolve, reject) => {
    database
      .getOneDoc(Resources, query, {
        _id: 0,
        __v: 0,
      })
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });

module.exports.resourceParser = async (url, host) => {
  try {
    const split = url.split(CONSTANTS.RESOURCE.DELIMITER);
    if (url.indexOf(host) !== -1 && split.length > 1) {
      const key = split[1].substr(1);
      const file = await this.getFileById({ fileName: key });
      return file;
    }
    return { error: "Resource not available" };
  } catch (e) {
    return e;
  }
};
