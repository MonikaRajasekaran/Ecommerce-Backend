const path = require("path");

const env = process.env.NODE_ENV || process.env.ENV || "development";
const configuration = require("config");

const rootPath = path.normalize(`${__dirname}/..`);
const contents = require(`./${env}`);
const config = {
  development: {
    root: rootPath,
    app: {
      name: "experiences",
    },
    port: process.env.PORT || 3000,
    extras: contents,
  },

  test: {
    root: rootPath,
    app: {
      name: "experiences",
    },
    port: process.env.PORT || 3000,
    extras: contents,
  },

  qa: {
    root: rootPath,
    app: {
      name: "experiences",
    },
    port: process.env.PORT || 3000,
    extras: contents,
  },

  production: {
    root: rootPath,
    app: {
      name: "experiences",
    },
    port: process.env.PORT || 3000,
    extras: contents,
  },
};

module.exports = Object.assign(configuration, config[env]);
