/* eslint-disable no-underscore-dangle */

const mock = require("../../mocks/api/mock");
// const clientWLData = require('../../mocks/data/clientWL.mock');
const authTest = require("./auth.api.spec");
// const uppMocks = require('../../mocks/api/upp.mock');
// const tesMocks = require('../../mocks/api/tes.mock');
// const etsMocks = require('../../mocks/api/ets.mock');
const initialize = (server) => {
  describe("API Test", () => {
    before((done) => {
      // Disabling all external APIs (except local)
      mock.disableRealHttp();
      // Loading data to temporary in-memory mongoDB
      // clientWLData.load().then(() => {
      //   done();
      // });
      done();
    });
    //   Run test files
    describe("Authentication API test", () => {
      // Creating mock endpoints
      /* // UPP Mocks
      uppMocks.create();
      // TES Mocks
      tesMocks.create();
      // ETS Mocks
      etsMocks.create(); */
      // Start the test
      authTest.initialize(server);
    });
    describe("UPP service is down", () => {
      // Creating mock endpoints
      // TES Mocks
      /* tesMocks.create();
      // ETS Mocks
      etsMocks.create(); */
      // Start the test
      // Example:
      // negativeAuthTest.initialize(server);
    });
    after((done) => {
      mock.enableRealHttp();
      mock.cleanAll();
      done();
    });
  });
};
module.exports = { initialize };
