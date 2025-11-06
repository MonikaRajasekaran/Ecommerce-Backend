const httpStatus = require("http-status");
const _ = require("lodash");

const walletService = require("../services/wallet.service");
const APIError = require("../../helpers/APIError.helper");
const CONSTANTS = require("../../helpers/Constants");
const logger = require("../../../config/winston")(module);

/**
 * @swagger
 * {
 *
 *	"tags" : {
 *		"name" : "Wallet",
 *		"description" : "Wallet Module"
 *	}
 * }
 */

/**
 * @swagger
 *{
 *	"paths" : {
 *		"/wallet/:walletId" : {
 *			"get" : {
 *				"tags": [
 *		          "Wallet"
 *		        ],
 *		        "summary": "get wallet by wallet ID",
 *		        "responses": {
 *		          "200": {
 *		 			 "description": "A wallet detauls of rqeuested walletId",
 *		 			 "content": {
 *		 			 	"application/json" : {
 *		 			 		"schema" : {
 *		 			 			"$ref" : '#/components/schemas/WalletResponse'
 *		 			 		}
 *		 			 	}
 *		 			 }
 *		          }
 *		        }
 *
 *			}
 *		}
 *	}
 *}
 */

module.exports.getByWalletId = (req, res, next) => {
  const { params, user } = req;
  const query = {};
  if (params.walletId === "mine") {
    query.userId = user.userId;
  } else {
    query.walletId = params.walletId;
  }
  walletService
    .getWalletByWalletId(query)
    .then((response) => {
      if (response && Object.keys(response).length !== 0) {
        return res.status(httpStatus.OK).json(response);
      }

      const code = `Err${CONSTANTS.MODULE_CODE.WALLET}${CONSTANTS.OPERATION_CODE.READ}${CONSTANTS.ERROR_TYPE.GENERIC}1`;

      logger.log({
        level: "info",
        message: `Failed to Get Merchant by merchantId ${code}`,
      });

      return next(
        new APIError(
          "Failed to Get Wallet by walletId",
          httpStatus.NOT_FOUND,
          true,
          res.__("failed_to_get"),
          code
        )
      );
    })
    .catch((e) => {
      const code = `Err${CONSTANTS.MODULE_CODE.WALLET}${CONSTANTS.OPERATION_CODE.READ}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
      return next(
        new APIError(e.message, e.status, true, res.__("system_error"), code)
      );
    });
};

module.exports.getWallet = (req, res, next) => {
  const { query } = req;
  walletService
    .getWallet(query)
    .then((response) => {
      return res
        .status(httpStatus.OK)
        .json(module.exports.formatResponse(response, "wallets"));
    })
    .catch((e) => {
      const code = `Err${CONSTANTS.MODULE_CODE.WALLET}${CONSTANTS.OPERATION_CODE.READ}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
      return next(
        new APIError(e.message, e.status, true, res.__("system_error"), code)
      );
    });
};

module.exports.addFund = (req, res, next) => {
  const { params, body } = req;
  if (body.amount >= CONSTANTS.MINIMUM_TOP) {
    const payload = { $inc: { availableFunds: body.amount } };
    logger.log({
      level: "info",
      message: JSON.stringify(payload),
    });

    return walletService
      .updateWallet(params, payload)
      .then((response) => {
        if (response && "walletId" in response) {
          return res.status(httpStatus.OK).json({
            message: res.__("wallet_api_update_successful"),
          });
        }
        const code = `Err${CONSTANTS.MODULE_CODE.WALLET}${CONSTANTS.OPERATION_CODE.UPDATE}${CONSTANTS.ERROR_TYPE.GENERIC}1`;
        logger.log({
          level: "info",
          message: `Failed to Update Wallet ${code}`,
        });
        return next(
          new APIError(
            "Failed to Update Wallet",
            httpStatus.UNPROCESSABLE_ENTITY,
            true,
            res.__("failed_to_create"),
            code
          )
        );
      })
      .catch((e) => {
        const code = `Err${CONSTANTS.MODULE_CODE.WALLET}${CONSTANTS.OPERATION_CODE.UPDATE}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
        return next(
          new APIError(e.message, e.status, true, res.__("system_error"), code)
        );
      });
  }
  const code = `Err${CONSTANTS.MODULE_CODE.WALLET}${CONSTANTS.OPERATION_CODE.UPDATE}${CONSTANTS.ERROR_TYPE.GENERIC}2`;
  logger.log({
    level: "info",
    message: `Amount Should be greater that ${CONSTANTS.MINIMUM_TOP} ($ ${
      CONSTANTS.MINIMUM_TOP / 100
    })`,
  });
  return next(
    new APIError(
      `Amount Should be greater that ${CONSTANTS.MINIMUM_TOP} ($${
        CONSTANTS.MINIMUM_TOP / 100
      })`,
      httpStatus.BAD_REQUEST,
      true,
      res.__("bad_request"),
      code
    )
  );
};

module.exports.deductFunds = (req, res, next) => {
  const { params, body } = req;

  const payload = { $inc: { availableFunds: -body.amount } };
  logger.log({
    level: "info",
    message: JSON.stringify(payload),
  });

  walletService
    .updateWallet(params, payload)
    .then((response) => {
      if (response && "walletId" in response) {
        return res.status(httpStatus.OK).json({
          message: res.__("wallet_api_update_successful"),
        });
      }
      const code = `Err${CONSTANTS.MODULE_CODE.WALLET}${CONSTANTS.OPERATION_CODE.UPDATE}${CONSTANTS.ERROR_TYPE.GENERIC}1`;
      logger.log({
        level: "info",
        message: `Failed to Update Wallet ${code}`,
      });
      return next(
        new APIError(
          "Failed to Update Wallet",
          httpStatus.UNPROCESSABLE_ENTITY,
          true,
          res.__("failed_to_create"),
          code
        )
      );
    })
    .catch((e) => {
      const code = `Err${CONSTANTS.MODULE_CODE.WALLET}${CONSTANTS.OPERATION_CODE.UPDATE}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
      return next(
        new APIError(e.message, e.status, true, res.__("system_error"), code)
      );
    });
};

// User API

module.exports.addFundtoMyaccount = (req, res, next) => {
  const { body, user } = req;

  if (body.amount >= CONSTANTS.MINIMUM_TOP) {
    const payload = { $inc: { availableFunds: body.amount } };
    logger.log({
      level: "info",
      message: JSON.stringify(payload),
    });

    return walletService
      .updateWallet({ userId: user.userId }, payload)
      .then((response) => {
        if (response && "walletId" in response) {
          return res.status(httpStatus.OK).json({
            message: res.__("wallet_api_update_successful"),
          });
        }
        const code = `Err${CONSTANTS.MODULE_CODE.WALLET}${CONSTANTS.OPERATION_CODE.UPDATE}${CONSTANTS.ERROR_TYPE.GENERIC}1`;
        logger.log({
          level: "info",
          message: `Failed to Update Wallet ${code}`,
        });
        return next(
          new APIError(
            "Failed to Update Wallet",
            httpStatus.UNPROCESSABLE_ENTITY,
            true,
            res.__("failed_to_create"),
            code
          )
        );
      })
      .catch((e) => {
        const code = `Err${CONSTANTS.MODULE_CODE.WALLET}${CONSTANTS.OPERATION_CODE.UPDATE}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
        return next(
          new APIError(e.message, e.status, true, res.__("system_error"), code)
        );
      });
  }
  const code = `Err${CONSTANTS.MODULE_CODE.WALLET}${CONSTANTS.OPERATION_CODE.UPDATE}${CONSTANTS.ERROR_TYPE.GENERIC}2`;
  logger.log({
    level: "info",
    message: `Amount Should be greater that ${CONSTANTS.MINIMUM_TOP} ($ ${
      CONSTANTS.MINIMUM_TOP / 100
    })`,
  });
  return next(
    new APIError(
      `Amount Should be greater that ${CONSTANTS.MINIMUM_TOP} ($${
        CONSTANTS.MINIMUM_TOP / 100
      })`,
      httpStatus.BAD_REQUEST,
      true,
      res.__("bad_request"),
      code
    )
  );
};

module.exports.formatResponse = (response, key) => {
  const result = {};
  result[key] = response;
  return result;
};
