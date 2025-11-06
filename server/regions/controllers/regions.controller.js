const httpStatus = require("http-status");
const $ = require("mongo-dot-notation");
const regionService = require("../services/regions.service");
const APIError = require("../../helpers/APIError.helper");
const helpers = require("../../helpers/helpers");
const logger = require("../../../config/winston")(module);
const CONSTANTS = require("../../helpers/Constants");

/**
 * @swagger
 * {
 *
 *  "tags" : {
 *    "name" : "Region",
 *    "description" : "Regional configuration data"
 *  }
 * }
 */

/**
 * @swagger
{
   "path": {
      "/regions": {
         "post": {
            "summary": "Create Regional Data",
            "tags": [
               "Region"
            ],
            "security": [
               {
                  "Bearer": []
               }
            ],
            "consumes": [
               "application/json"
            ],
            "produces": [
               "application/json"
            ],
            "parameters": [
               {
                  "name": "Authorization",
                  "in": "header",
                  "required": true,
                  "type": "string"
               }
            ],
            "requestBody": {
               "required": true,
               "content": {
                  "application/json": {
                     "schema": {
                        "$ref": "#/components/schemas/RegionCreateRequest"
                     }
                  }
               }
            },
            "responses": {
               "200": {
                  "description": "A Regional schema",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/RegionCreateResponse"
                        }
                     }
                  }
               }
            }
         }
      }
   }
}
*/

module.exports.createRegion = (req, res, next) => {
  const { body } = req;

  logger.log({
    level: "info",
    message: JSON.stringify(body),
  });

  regionService
    .createRegion(body)
    .then((response) => {
      if (response && "regionId" in response) {
        return res.status(httpStatus.CREATED).json(response);
      }
      const code = `Err${CONSTANTS.MODULE_CODE.REGION}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.GENERIC}1`;
      logger.log({
        level: "info",
        message: `Failed to Create Region ${code}`,
      });
      return next(
        new APIError(
          "Failed to Create Region",
          httpStatus.UNPROCESSABLE_ENTITY,
          true,
          res.__("failed_to_create"),
          code
        )
      );
    })
    .catch((e) => {
      const code = `Err${CONSTANTS.MODULE_CODE.REGION}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
      return next(
        new APIError(e.message, e.status, true, res.__("system_error"), code)
      );
    });
};

/**
 * @swagger
{
   "path": {
      "/regions": {
         "patch": {
            "summary": "Update Regional Data",
            "tags": [
               "Region"
            ],
            "security": [
               {
                  "Bearer": []
               }
            ],
            "consumes": [
               "application/json"
            ],
            "produces": [
               "application/json"
            ],
            "parameters": [
               {
                  "name": "Authorization",
                  "in": "header",
                  "required": true,
                  "type": "string"
               }
            ],
            "requestBody": {
               "required": true,
               "content": {
                  "application/json": {
                     "schema": {
                        "$ref": "#/components/schemas/RegionUpdateRequest"
                     }
                  }
               }
            },
            "responses": {
               "200": {
                  "description": "A Regional schema",
                  "content": {
                     "application/json": {
                        "schema": {
                           "$ref": "#/components/schemas/RegionUpdateResponse"
                        }
                     }
                  }
               }
            }
         }
      }
   }
}
*/
module.exports.updateRegionDetails = async (req, res, next) => {
  const { params, body } = req;
  let payload;
  if (body.currency) {
    payload = body.currency;
  } else if (body.subscription) {
    payload = { $push: { subscriptions: body.subscription } };
  } else if (body.linkedAccount) {
    payload = { $push: { linkedAccounts: body.linkedAccount } };
  } else if (body.bank) {
    payload = { $push: { banks: body.bank } };
  } else if (body.payee) {
    payload = { $push: { payee: body.payee } };
  } else if (body.defaultTransactions) {
    payload = { $push: { defaultTransactions: body.defaultTransactions } };
  } else if (body.categories) {
    payload = { $push: { categories: body.categories } };
  } else if (body.offers) {
    payload = { $push: { offers: body.offers } };
  } else if (body.employerEmployee) {
    payload = { $push: { employerEmployee: body.employerEmployee } };
  } else if (body.defaultAccountIdFacePay) {
    payload = { defaultAccountIdFacePay: body.defaultAccountIdFacePay };
  } else if (body.defaultMerchants) {
    payload = $.flatten(body);
  } else if (body.contact) {
    payload = { $push: { contacts: body.contact } };
  } else if (body.pfmCategories) {
    payload = {
      $push: {
        pfmCategories: regionService.generatePFMData(body.pfmCategories),
      },
    };
  }

  logger.info(`Updating region with payload: ${JSON.stringify(payload)}`);
  const { error: e, data: regionalData } = await helpers.awaitWrap(
    regionService.updatePayee(params, payload)
  );
  if (e) {
    const code = `Err${CONSTANTS.MODULE_CODE.REGION}${CONSTANTS.OPERATION_CODE.UPDATE}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"), code)
    );
  }
  if (regionalData !== null && regionalData && regionalData.regionId) {
    return res
      .status(httpStatus.CREATED)
      .send({ messaage: res.__("region_updated_success") });
  }
  const code = `Err${CONSTANTS.MODULE_CODE.REGION}${CONSTANTS.OPERATION_CODE.UPDATE}${CONSTANTS.ERROR_TYPE.GENERIC}1`;
  return next(
    new APIError(
      "Regional Detail is not available",
      httpStatus.NOT_FOUND,
      true,
      res.__("update_failed"),
      code
    )
  );
};

module.exports.updateOfferDetails = async (req, res, next) => {
  const { params, body } = req;

  const { error: e, data: regionResponse } = await helpers.awaitWrap(
    regionService.updateOfferDetails(params, body)
  );

  if (e) {
    const code = `Err${CONSTANTS.MODULE_CODE.REGION}${CONSTANTS.OPERATION_CODE.UPDATE}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"), code)
    );
  }
  if (regionResponse && regionResponse.regionId) {
    return res
      .status(httpStatus.CREATED)
      .send({ messaage: res.__("offer_updated_success") });
  }
  const code = `Err${CONSTANTS.MODULE_CODE.REGION}${CONSTANTS.OPERATION_CODE.UPDATE}${CONSTANTS.ERROR_TYPE.GENERIC}1`;
  return next(
    new APIError(
      "offers  is not available",
      httpStatus.NOT_FOUND,
      true,
      res.__("update_failed"),
      code
    )
  );
};

module.exports.deleteContact = async (req, res, next) => {
  const { params } = req;
  logger.log({
    level: "info",
    message: JSON.stringify(params),
  });
  const { error: e, data: regionResponse } = await helpers.awaitWrap(
    regionService.deleteContact(params)
  );

  if (e) {
    const code = `Err${CONSTANTS.MODULE_CODE.REGION}${CONSTANTS.OPERATION_CODE.DELETE}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"), code)
    );
  }

  if (regionResponse && regionResponse.regionId) {
    return res
      .status(httpStatus.CREATED)
      .send({ messaage: res.__("offer_updated_success") });
  }
  const code = `Err${CONSTANTS.MODULE_CODE.REGION}${CONSTANTS.OPERATION_CODE.DELETE}${CONSTANTS.ERROR_TYPE.GENERIC}1`;
  return next(
    new APIError(
      "contactId not found",
      httpStatus.NOT_FOUND,
      true,
      res.__("update_failed"),
      code
    )
  );
};

module.exports.deletePfmData = async (req, res, next) => {
  const { params } = req;

  logger.log({
    level: "info",
    message: JSON.stringify(params),
  });

  const { error: e, data: regionResponse } = await helpers.awaitWrap(
    regionService.deletePfmData(params)
  );

  if (e) {
    const code = `Err${CONSTANTS.MODULE_CODE.REGION}${CONSTANTS.OPERATION_CODE.DELETE}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"), code)
    );
  }

  if (regionResponse && regionResponse.regionId) {
    return res
      .status(httpStatus.CREATED)
      .send({ messaage: res.__("offer_updated_success") });
  }
  const code = `Err${CONSTANTS.MODULE_CODE.REGION}${CONSTANTS.OPERATION_CODE.DELETE}${CONSTANTS.ERROR_TYPE.GENERIC}1`;
  return next(
    new APIError(
      "regionId not found",
      httpStatus.NOT_FOUND,
      true,
      res.__("update_failed"),
      code
    )
  );
};
