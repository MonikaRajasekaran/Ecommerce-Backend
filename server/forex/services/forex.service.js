const mongoose = require("mongoose");
const request = require("request");
const _ = require("lodash");
const httpStatus = require("http-status");
const database = require("../../helpers/db.helper");
const CONSTANTS = require("../../helpers/Constants");
const decrypter = require("../../helpers/decrypter.helper");
const config = require("../../../config/config");
const APIError = require("../../helpers/APIError.helper");
const logger = require("../../../config/winston")(module);

require("../models/forex.model");

const Forex = mongoose.model("Forex");

module.exports.createForex = (data) =>
  new Promise((resolve, reject) => {
    database
      .save(Forex, data)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });

module.exports.getForex = (query) =>
  new Promise((resolve, reject) => {
    database
      .getOneDoc(Forex, query, {
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

module.exports.fetchForexInfoExternalService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const URL = `${CONSTANTS.FOREX_BASEURL}?symbol=${
        CONSTANTS.FOREX_BASE_CURRENCY
      }&type=forex&access_key=${decrypter.decrypt(config.extras.forex)}`;

      logger.info(URL);
      return request(URL, { json: true }, async (err, res, body) => {
        if (err) {
          logger.error(err);
          return reject(err);
        }
        logger.info(body);
        if (res && res.statusCode === 200 && body.code && body.code === 200) {
          const list = Object.keys(body.response);
          const currencies = [];
          for (let i = 0; i < list.length; i += 1) {
            const currency = list[i];
            const obj = {
              currency,
              value: body.response[currency],
            };
            currencies.push(obj);
          }
          return resolve({ currencies });
        }
        return reject(
          new APIError("Failed to get Details from external site", body.code)
        );
      });
    } catch (e) {
      return reject(e);
    }
  });

module.exports.prepareData = (forexList, query) => {
  const baseCurrency = query.baseCurrency
    ? query.baseCurrency
    : CONSTANTS.FOREX_BASE_CURRENCY;
  const baseUnit = query.unit ? query.unit : CONSTANTS.FOREX_BASE_UNIT;
  const conversionList = query.convertTo ? query.convertTo.split(",") : [];
  const keyList = _.keyBy(forexList.currencies, "currency");
  const baseValue = keyList[baseCurrency] ? keyList[baseCurrency].value : 0;
  const response = [];
  _.map(forexList.currencies, (obj) => {
    if (conversionList.length > 0) {
      if (conversionList.indexOf(obj.currency) > -1) {
        let { value } = obj;
        value /= baseValue;
        const temp = {
          destination: obj.currency,
          rate: value * baseUnit,
        };
        response.push(temp);
      }
    } else {
      let { value } = obj;
      value /= baseValue;
      const temp = {
        destination: obj.currency,
        rate: value * baseUnit,
      };
      response.push(temp);
    }
  });

  return response;
};

module.exports.convertToForex = async (query) => {
  const today = new Date();
  const date = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;
  try {
    // check for today's data
    let forex = await this.getForex({ date });
    if (forex === null || !forex.forexId) {
      // get from API update the DB and get from database
      const forexData = await this.fetchForexInfoExternalService();
      if (!forexData || !forexData.currencies) {
        const code = `Err${CONSTANTS.MODULE_CODE.CONFIGURATION}${CONSTANTS.OPERATION_CODE.READ}${CONSTANTS.ERROR_TYPE.GENERIC}6`;
        throw new APIError(
          "Failed to fetch the currencies",
          httpStatus.NOT_FOUND,
          true,
          code
        );
      }
      forexData.date = date;
      forex = await this.createForex(forexData);
      if (!forex || !forex.forexId) {
        const code = `Err${CONSTANTS.MODULE_CODE.CONFIGURATION}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.GENERIC}6`;
        throw new APIError(
          "Failed to save the currencies",
          httpStatus.NOT_FOUND,
          true,
          code
        );
      }
    }
    const baseCurrency = query.baseCurrency
      ? query.baseCurrency
      : CONSTANTS.FOREX_BASE_CURRENCY;
    // prepare the data as per the query
    const response = this.prepareData(forex, query);
    return { source: baseCurrency, data: response };
  } catch (e) {
    throw e;
  }
};
