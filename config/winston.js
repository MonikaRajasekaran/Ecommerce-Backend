const { createLogger, format, transports } = require("winston");

const { combine, timestamp, label, printf } = format;
const path = require("path");
const settings = require("../server/helpers/Constants");

const getLabel = (callingModule) => {
  const parts = callingModule.filename.split(path.sep);
  return path.join(parts[parts.length - settings.SEGMENT], parts.pop());
};

const myFormat = printf(
  ({ level, message, label, timestamp }) =>
    `${timestamp} [${label}] ${level}: ${message}`
);

const logger = (module) =>
  createLogger({
    format: combine(label({ label: getLabel(module) }), timestamp(), myFormat),
    transports: [
      new transports.Console(),
      new transports.File({
        filename: "exp-platform-access.log",
        level: "info",
        timestamp: true,
      }),
      new transports.File({
        filename: "exp-platform-error.log",
        level: "error",
        timestamp: true,
      }),
    ],
  });

module.exports = logger;
