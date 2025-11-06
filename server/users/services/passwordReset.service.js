const mongoose = require("mongoose");
const database = require("../../helpers/db.helper");
const emailService = require("../../email/services/email.service");
const config = require("../../../config/config");

require("../models/passwordReset.model");

const Model = mongoose.model("PasswordReset");

module.exports.create = (data) =>
  new Promise((resolve, reject) => {
    database
      .save(Model, data)
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });

module.exports.get = (query) =>
  new Promise((resolve, reject) => {
    database
      .getOneDoc(Model, query)
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });

module.exports.delete = (query) =>
  new Promise((resolve, reject) => {
    database
      .deleteOne(Model, query)
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });

module.exports.update = (query, payload) =>
  new Promise((resolve, reject) => {
    database
      .updateDoc(Model, query, payload)
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });

module.exports.generateResetCode = async (user) => {
  try {
    const request = await this.get({ userId: user.userId });
    if (request) {
      await this.delete({ requestId: request.requestId });
    }
    const entry = await this.create({ userId: user.userId });
    return entry;
  } catch (e) {
    throw e;
  }
};

module.exports.triggerResetEmail = async (url, data) => {
  try {
    const response = await emailService.sendEmail(
      { receiver: [data.email] },
      {
        name: `${data.firstName} ${data.lastName}`,
        url,
      },
      config.extras.sendGrid_templates.reset_password
    );
    return response[0];
  } catch (e) {
    return e;
  }
};
