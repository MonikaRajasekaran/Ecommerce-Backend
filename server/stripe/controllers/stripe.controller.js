const httpStatus = require("http-status");
const _ = require("lodash");
const service = require("../services/stripe.service");
const CONSTANTS = require("../../helpers/Constants");
const APIError = require("../../helpers/APIError.helper");
const logger = require("../../../config/winston")(module);

module.exports.getConnectedAccounts = (req, res, next) => {
  const { query } = req;
  service
    .getConnectedAccounts(query)
    .then((response) => {
      return res.status(httpStatus.OK).json(response);
    })
    .catch((e) => {
      const code = `Err${CONSTANTS.MODULE_CODE.STRIPE}${CONSTANTS.OPERATION_CODE.READ}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
      return next(
        new APIError(e.message, e.status, true, res.__("system_error"), code)
      );
    });
};

module.exports.onboardStripeAccount = (req, res, next) => {
  const { body, user } = req;
  const refreshUrl = body.refreshUrl;
  const returnUrl = body.returnUrl;
  const payload = _.omit(body, ["refreshUrl", "returnUrl"]);
  try {
    return service
      .createExpressAccount(payload)
      .then(async (response) => {
        if (response.id) {
          const link = {
            account: response.id,
            refresh_url: refreshUrl,
            return_url: returnUrl,
            type: "account_onboarding",
          };
          const result = await Promise.all([
            service.createAccountLink(link),
            service.createConnectedMap({
              connectedAccountId: response.id,
              userId: user.userId,
            }),
          ]);
          if (result[0].url && result[1].stripeId) {
            return res
              .status(httpStatus.OK)
              .json({ ...result[0], accountId: response.id });
          }
          const code = `Err${CONSTANTS.MODULE_CODE.STRIPE}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.GENERIC}2`;

          logger.log({
            level: "info",
            message: `Failed to Create Stripe Link ${code}`,
          });

          return next(
            new APIError(
              "Failed to Create Stripe Link",
              httpStatus.NOT_FOUND,
              true,
              res.__("failed_to_get"),
              code
            )
          );
        }
        const code = `Err${CONSTANTS.MODULE_CODE.STRIPE}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.GENERIC}1`;

        logger.log({
          level: "info",
          message: `Failed to Create Stripe Account ${code}`,
        });

        return next(
          new APIError(
            "Failed to Create Stripe Account",
            httpStatus.NOT_FOUND,
            true,
            res.__("failed_to_get"),
            code
          )
        );
      })
      .catch((e) => {
        const code = `Err${CONSTANTS.MODULE_CODE.STRIPE}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
        return next(
          new APIError(e.message, e.status, true, res.__("system_error"), code)
        );
      });
  } catch (e) {
    const code = `Err${CONSTANTS.MODULE_CODE.STRIPE}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"), code)
    );
  }
};

module.exports.retreiveStripeAccount = async (req, res, next) => {
  const { body, user } = req;
  const refreshUrl = body.refreshUrl;
  const returnUrl = body.returnUrl;
  try {
    const stripeAccount = await service.getMyConnectedAccounts({
      userId: user.userId,
    });
    if (stripeAccount && stripeAccount.connectedAccountId) {
      return service
        .retreiveAccount(stripeAccount.connectedAccountId)
        .then(async (response) => {
          if (response.id) {
            const link = {
              account: response.id,
              refresh_url: refreshUrl,
              return_url: returnUrl,
              type: "account_update",
            };
            const result = await service.createAccountLink(link);
            if (result.url) {
              return res.status(httpStatus.OK).json({ ...response, result });
            }
            const code = `Err${CONSTANTS.MODULE_CODE.STRIPE}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.GENERIC}2`;

            logger.log({
              level: "info",
              message: `Failed to Create Stripe Link ${code}`,
            });

            return next(
              new APIError(
                "Failed to Create Stripe Link",
                httpStatus.NOT_FOUND,
                true,
                res.__("failed_to_get"),
                code
              )
            );
          }
          const code = `Err${CONSTANTS.MODULE_CODE.STRIPE}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.GENERIC}1`;

          logger.log({
            level: "info",
            message: `Failed to Create Stripe Account ${code}`,
          });

          return next(
            new APIError(
              "Failed to Create Stripe Account",
              httpStatus.NOT_FOUND,
              true,
              res.__("failed_to_get"),
              code
            )
          );
        })
        .catch((e) => {
          const code = `Err${CONSTANTS.MODULE_CODE.STRIPE}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
          return next(
            new APIError(
              e.message,
              e.status,
              true,
              res.__("system_error"),
              code
            )
          );
        });
    }
    const code = `Err${CONSTANTS.MODULE_CODE.STRIPE}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.GENERIC}2`;

    logger.log({
      level: "info",
      message: `Failed to Retreive Stripe Account ${code}`,
    });

    return next(
      new APIError(
        "Failed to Retreive Stripe Account",
        httpStatus.NOT_FOUND,
        true,
        res.__("failed_to_get"),
        code
      )
    );
  } catch (e) {
    const code = `Err${CONSTANTS.MODULE_CODE.STRIPE}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"), code)
    );
  }
};
