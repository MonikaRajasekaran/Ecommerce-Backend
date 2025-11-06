/**
 * This file is used to mock the external endpoints.
 *
 * Using nock, the external endpoints are defined here with
 * the expected reply.
 *
 */
const nock = require("nock");
// const uppMocks = require('../upp.mock');
// const tesMocks = require('../tes.mock');
// const etsMocks = require('./ets.mock');
// const notificationMocks = require('../notification.mock');

/**
 * This function will create all mock endpoints inside the function.
 *
 * @requires nock
 */
const create = () => {
  // UPP Mocks
  // uppMocks.create();
  // TES Mocks
  // tesMocks.create();
  // Notification Mocks
  // notificationMocks.create();
  // ETS Mocks
  // etsMocks.create();
};

/**
 * This function will kill all active nocks.
 *
 * @requires nock
 */
const cleanAll = () => nock.cleanAll();

/**
 * This function will return all active nocks.
 *
 * @requires nock
 * @return [string] list of mock endpoints.
 */
const activeNocks = () => nock.activeMocks();

/**
 * By default, any requests made to a host that is not mocked will be executed normally.
 * This function will block these requests.
 * Note: the localhost will be enabled for accessing the mongo
 *
 * @requires nock
 */
const disableRealHttp = () => {
  nock.disableNetConnect();
  nock.enableNetConnect("127.0.0.1");
};

/**
 * This function will enable any real HTTP requests (the default behavior)
 *
 * @requires nock
 */
const enableRealHttp = () => {
  nock.enableNetConnect();
};

module.exports = {
  create,
  cleanAll,
  activeNocks,
  disableRealHttp,
  enableRealHttp,
};
