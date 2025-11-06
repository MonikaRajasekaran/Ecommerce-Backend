require("dotenv").config();
const fs = require("fs");
const httpStatus = require("http-status");
const mongoose = require("../config/persistance");
const CONSTANTS = require("../server/helpers/Constants");
const regionService = require("../server/regions/services/regions.service");
const APIError = require("../server/helpers/APIError.helper");
const logger = require("../config/winston")(module);

function seed() {
  const country = fs.readFileSync("json/country.json");
  const countryList = JSON.parse(country);
  const phone = fs.readFileSync("json/phone.json");
  const phoneList = JSON.parse(phone);
  const list = [];
  countryList.map((value) => {
    const obj = value;
    if (value.currency.code !== "" && phoneList[value.isoAlpha2]) {
      if (phoneList[value.isoAlpha2].indexOf(" and ") > -1) {
        const splited = phoneList[value.isoAlpha2].split(" and ");
        obj.phoneCode = splited[0];
      } else {
        obj.phoneCode = phoneList[value.isoAlpha2];
      }
      list.push(obj);
    }
    return true;
  });
  return new Promise(async (resolve, reject) => {
    try {
      const bulkList = await regionService.addBulk(list);
      if (bulkList) {
        return resolve(bulkList);
      }
      const code = `Err${CONSTANTS.MODULE_CODE.SASSPASS}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.GENERIC}2`;
      return reject(
        new APIError(
          "Failed to create Region",
          httpStatus.BAD_REQUEST,
          true,
          "failed_to_create",
          code
        )
      );
    } catch (e) {
      const code = `Err${CONSTANTS.MODULE_CODE.SASSPASS}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
      return reject(
        new APIError(e.message, e.status, true, "system_error", code)
      );
    }
  });
}

mongoose.connection().then((value) => {
  if (value) {
    logger.info("Database connection open");
    seed()
      .then(() => {
        logger.info("All seed data populated successfully");
        process.exit(0);
      })
      .catch((err) => {
        logger.error(err);
        logger.error("There was an error while populating seed data", err);
        process.exit(1);
      });
  }
});
