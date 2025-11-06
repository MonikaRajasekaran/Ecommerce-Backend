/**
 * This file is used to loading data to temporary in-memory mongoDB.
 *
 * Load all data that is required for the API tests.
 *
 * @author Felicia Amy.
 * @since  4/6/2019
 */
const userModel = require("../../../server/users/models/users.model");
const testData = require("../../testData");
/**
 * This function will load all the data needed for API tests.
 * Data is added as required for the test.
 */
const load = () => {
  const promises = [];
  promises.push(
    userModel.create({
      app_id: testData.appId.receiptdee,
      clientName: testData.clients.visa.name,
      clientDomain: testData.clients.visa.domain,
      status: testData.clients.visa.status,
    })
  );
  promises.push(
    userModel.create({
      app_id: testData.appId.receiptdee,
      clientName: testData.clients.gmail.name,
      clientDomain: testData.clients.gmail.domain,
      status: testData.clients.gmail.status,
    })
  );
  return Promise.all(promises);
};

module.exports = { load };
