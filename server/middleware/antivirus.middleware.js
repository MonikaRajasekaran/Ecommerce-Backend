const NodeClam = require("clamscan");
const path = require("path");
const httpStatus = require("http-status");
const fs = require("fs");
const _ = require("lodash");
const logger = require("../../config/winston")(module);
const APIError = require("../helpers/APIError.helper");
const Constants = require("../helpers/Constants");

const antivirusCheck = async (location) => {
  try {
    logger.verbose(`antivirusCheck init NodeClam`);
    const clamscan = await new NodeClam().init({
      debug_mode: true,
      remove_infected: true, // Removes files if they are infected
      quarantine_infected: "~/infected/", // Move file here. remove_infected must be FALSE, though.
      scan_log: "/var/log/node-clam", // You're a detail-oriented security professional.

      scan_recursively: false,
      clamdscan: {
        socket: "/var/run/clamav/clamd.ctl",
        timeout: 120000,
        local_fallback: true,
        path: "/var/lib/clamav",
        config_file: "/etc/clamav/clamd.conf",
      },
    });

    const { isInfected, viruses } = await clamscan.scan_file(location);
    if (isInfected || viruses.length > 0) {
      logger.error(`The file is INFECTED with ${viruses}`);
      try {
        fs.unlinkSync(location);
      } catch (err) {
        logger.error(`antivirusCheck Error: ${JSON.stringify(err)}`);
      }
      return { status: false };
    }
    return { status: true };
  } catch (e) {
    logger.error(`antivirusCheck Error: ${JSON.stringify(e)}`);
    return e;
  }
};

exports.viruscheck = () => async (req, res, next) => {
  logger.verbose(`viruscheck start`);
  const { file } = req;
  if (!_.isEmpty(file)) {
    let safePath = null;
    if (_.get(file, ["path"], null)) {
      safePath = path.normalize(file.path).replace(/^(\.\.(\/|\\|$))+/, "");
    }
    logger.info(`viruscheck got safePath ${safePath}`);
    const absolutePath = path.resolve(safePath);
    if (safePath) {
      if (
        (process.env.ANTIVIRUS && process.env.ANTIVIRUS === "false") ||
        process.env.ENV === "development"
      ) {
        req.safePath = safePath;
        return next();
      }
      try {
        const avStatus = await antivirusCheck(absolutePath); // Pass the full path of the file
        if (avStatus && !avStatus.status) {
          logger.error(`viruscheck Error: File has suspicious content`);
          const code = `Err${Constants.MODULE_CODE.RESOURCE}${Constants.OPERATION_CODE.UPLOAD}${Constants.ERROR_TYPE.GENERIC}1`;
          return next(
            new APIError(
              "File has suspicious content",
              httpStatus.NOT_ACCEPTABLE,
              true,
              res.__("antivirus_scan_malicious_activity")
            ),
            code
          );
        }
        if ("level" in avStatus && avStatus.level === "error") {
          logger.error(
            `viruscheck Error: Antivirus Scanner is not working properly`
          );
          const code = `Err${Constants.MODULE_CODE.RESOURCE}${Constants.OPERATION_CODE.UPLOAD}${Constants.ERROR_TYPE.GENERIC}3`;
          return next(
            new APIError(
              "Antivirus Scanner is not working properly",
              httpStatus.NOT_ACCEPTABLE,
              true,
              "Antivirus Scan: Failed"
            ),
            code
          );
        }
        req.safePath = safePath;
        return next();
      } catch (e) {
        logger.error(`viruscheck Error: ${JSON.stringify(e)}`);
        const code = `Err${Constants.MODULE_CODE.RESOURCE}${Constants.OPERATION_CODE.UPLOAD}${Constants.ERROR_TYPE.SYSTEM}1`;
        return next(
          new APIError(
            "System Error: Something went wrong",
            httpStatus.NOT_ACCEPTABLE,
            true,
            res.__("system_error")
          ),
          code
        );
      }
    } else {
      logger.error(`viruscheck Error: Antivirus File path is not valid`);
      const code = `Err${Constants.MODULE_CODE.RESOURCE}${Constants.OPERATION_CODE.UPLOAD}${Constants.ERROR_TYPE.GENERIC}4`;
      return next(
        new APIError(
          "File path is not valid",
          httpStatus.NOT_ACCEPTABLE,
          true,
          res.__("file_not_found")
        ),
        code
      );
    }
  }
  logger.error(`viruscheck Error: File should not be empty`);
  const code = `Err${Constants.MODULE_CODE.RESOURCE}${Constants.OPERATION_CODE.UPLOAD}${Constants.ERROR_TYPE.GENERIC}2`;
  return next(
    new APIError(
      "File should not be empty",
      httpStatus.NOT_ACCEPTABLE,
      true,
      res.__("file_not_found")
    ),
    code
  );
};
