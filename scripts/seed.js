require("dotenv").config();
const httpStatus = require("http-status");
const mongoose = require("../config/persistance");
const CONSTANTS = require("../server/helpers/Constants");
const userService = require("../server/users/services/users.service");
const APIError = require("../server/helpers/APIError.helper");
const logger = require("../config/winston")(module);

function seed() {
  return new Promise(async (resolve, reject) => {
    const body = {
      firstName: process.env.FIRSTNAME,
      username: process.env.USERNAME,
      email: process.env.EMAIL,
      lastName: process.env.LASTNAME,
      password: process.env.PASSWORD,
      isVerified: true,
      isActive: true,
      role: ["ROOT"],
      regionId: null,
      meta: {},
    };
    try {
      const account = await userService.getUserbyId({
        username: process.env.USERNAME,
        role: { $in: ["ROOT"] },
      });
      if (!account) {
        const newUser = await userService.createUser(body);
        if (newUser && newUser.userId) {
          return resolve(newUser);
        }
        const code = `Err${CONSTANTS.MODULE_CODE.SASSPASS}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.GENERIC}3`;
        return reject(
          new APIError(
            "Failed to onboard user",
            httpStatus.BAD_REQUEST,
            true,
            "failed_to_create",
            code
          )
        );
      }
      const code = `Err${CONSTANTS.MODULE_CODE.SASSPASS}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.GENERIC}2`;
      return reject(
        new APIError(
          "Account already exist",
          httpStatus.BAD_REQUEST,
          true,
          "duplicate_entry",
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
