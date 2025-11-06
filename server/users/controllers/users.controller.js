/* eslint-disable no-underscore-dangle */
const httpStatus = require("http-status");
const APIError = require("../../helpers/APIError.helper");
const awshelper = require("../../helpers/aws.helper");
const profileService = require("../../userProfile/services/profile.service");
const orgnaisation = require("../../helpers/org.helper");
const { Issuer } = require("openid-client");

const config = require("../../../config/config");

module.exports.register = async (req, res, next) => {
  const { cognito, body } = req;

  try {
    // 1. Register the user with Cognito
    const attributes = {
      email: body.email,
      given_name: body.givenName,
      family_name: body.familyName,
    };
    const response = await cognito.register(
      body.username,
      body.password,
      attributes
    );

    // 2. Assign user to Cognito group
    await awshelper.updateGroup(body.username, "USER");

    // 3. Create user profile in database
    const profile = {
      username: body.username,
      fullName: body.givenName,
      email: body.email,
      userId: response.userSub,
    };
    await profileService.create(profile);
    return res.status(httpStatus.CREATED).send(response);
  } catch (e) {
    console.log(e);
    const status = e.status || httpStatus.BAD_REQUEST;
    return next(
      new APIError(e.message, status, true, res.__("system_error"), "code")
    );
  }
};
module.exports.confirmAccount = (req, res, next) => {
  const { cognito, body } = req;

  cognito
    .verifyAccount(body.username, body.code)
    .then((response) => res.status(httpStatus.OK).send({ message: response }))
    .catch((e) => {
      const status = e.status ? e.status : httpStatus.BAD_REQUEST;
      return next(
        new APIError(e.message, status, true, res.__("system_error"), "code")
      );
    });
};

module.exports.retryCode = (req, res, next) => {
  const { cognito, body } = req;

  cognito
    .resendCode(body.username)
    .then((response) => res.status(httpStatus.OK).send({ message: response }))
    .catch((e) => {
      const status = e.status ? e.status : httpStatus.BAD_REQUEST;
      return next(
        new APIError(e.message, status, true, res.__("system_error"), "code")
      );
    });
};

module.exports.authenticate = (req, res, next) => {
  const { cognito, body } = req;
  cognito
    .authenticate(body.username, body.password)
    .then(async (response) => res.status(httpStatus.OK).send(response))
    .catch((e) => {
      const status = e.status ? e.status : httpStatus.BAD_REQUEST;
      return next(
        new APIError(e.message, status, true, res.__("system_error"), "code")
      );
    });
};

module.exports.ForgotPassword = (req, res, next) => {
  const { cognito, body } = req;
  cognito
    .forgotPassword(body.username)
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((e) => {
      const status = e.status ? e.status : httpStatus.BAD_REQUEST;
      return next(
        new APIError(e.message, status, true, res.__("system_error"), "code")
      );
    });
};

module.exports.resetPassowrd = (req, res, next) => {
  const { cognito, body } = req;
  cognito
    .resetPassword(body.username, body.code, body.password)
    .then((response) => res.status(httpStatus.OK).send({ message: response }))
    .catch((e) => {
      const status = e.status ? e.status : httpStatus.BAD_REQUEST;
      return next(
        new APIError(e.message, status, true, res.__("system_error"), "code")
      );
    });
};

module.exports.updatePassword = (req, res, next) => {
  const { cognito, body, user } = req;
  cognito
    .updatePassword(user.username, body.oldPassword, body.newPassword)
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((e) => {
      const status = e.status ? e.status : httpStatus.BAD_REQUEST;
      return next(
        new APIError(e.message, status, true, res.__("system_error"), "code")
      );
    });
};

module.exports.refreshToken = (req, res, next) => {
  const { cognito, body } = req;
  cognito
    .refreshSession(body.username, body.refreshToken)
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((e) => {
      const status = e.status ? e.status : httpStatus.BAD_REQUEST;
      return next(
        new APIError(e.message, status, true, res.__("system_error"), "code")
      );
    });
};

module.exports.forceUpdate = (req, res, next) => {
  const { cognito, body } = req;
  cognito
    .forceUpdate(body.username, body.password, body.session, body.attributes)
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((e) => {
      const status = e.status ? e.status : httpStatus.BAD_REQUEST;
      return next(
        new APIError(e.message, status, true, res.__("system_error"), "code")
      );
    });
};
