/**
 * This file is used to initialize all the API tests.
 *
 * npm run api-test will call this file to test all the APIs.
 * In order to run the API test file, the file has to be imported
 * here and it will be run once the test pre-requisites are completed.
 */
// Rewire mongoose
require("../util/mongooseMock");
const mock = require("../mocks/api/mock");
const server = require("../../app");
// Importing Tests
const userTest = require("./users/user.test");

describe("API Test", () => {
  //   leave it here in case we need it
  before((done) => {
    done();
  });
  //   Run test files
  describe("User API test", () => {
    userTest.initialize(server);
  });
  after((done) => {
    mock.enableRealHttp();
    mock.cleanAll();
    done();
  });
});
