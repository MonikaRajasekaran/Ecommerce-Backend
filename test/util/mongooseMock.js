/**
 * This file is used to stub the mongoose module
 *
 * This will replace the existing mongoose module with the mongo-memory-server.
 * Meaning all the mongoose call will be handled by the mongoose from this file
 * instead of the one in config/mongoose.js
 *
 */
const rewire = require("rewire");
const { MongoMemoryServer } = require("mongodb-memory-server");
// const { MachineKey } = require('@visa/protectconfig');
const mongoose = require("mongoose");
const logger = require("../../config/winston")(module); // The reason for this demo.
// const configFile = `config/${process.env.NODE_ENV}.json`;
const mongooseRewired = rewire("../../config/persistance");
/* This is a mock mongoDB that is used for testing purposes.
 * The mongodb-memory-server will create a temporary in memory mongoDB to be used for testing.
 * The temporary mongoDB will be emptied after the test ended.
 */
const mongoServer = new MongoMemoryServer();
mongoose.Promise = Promise;
mongoServer.getConnectionString().then((mongoUri) => {
  logger.info(mongoUri);
  mongoose.connect(
    mongoUri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    // config.mongodb.auth,
    (err) => {
      if (err) {
        logger.error(`ERROR connecting to: ${mongoUri}. ${err}`);
      } else {
        logger.info(`Succeeded connected to: ${mongoUri}`);
      }
    }
  );
});
// eslint-disable-next-line no-underscore-dangle
mongooseRewired.__set__("mongoose", mongoose);
