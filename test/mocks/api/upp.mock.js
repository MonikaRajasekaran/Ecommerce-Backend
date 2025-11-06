/**
 * This file is used to mock UPP endpoints.
 *
 * Using nock, the UPP endpoints are defined here with
 * the expected reply.
 *
 * @author Felicia Amy.
 * @since  17/6/2019
 */
const nock = require("nock");
const config = require("../../../config/config");
const testData = require("../../testData");
const helper = require("../../util/helper");

/**
 * This function will create all mock endpoints inside the function.
 *
 * @requires nock
 */
const create = () => {
  nock(config.central_service.base_url)
    .persist()
    .post("/api/v1/register")
    .reply(200, {
      register_id: testData.registerId,
    });
  nock(config.central_service.base_url)
    .persist()
    .patch(/\/api\/v1\/users\/\d+$/)
    .reply(200, {
      register_id: testData.registerId,
    });
  nock(config.central_service.base_url)
    .persist()
    .post("/api/v1/security/tokens")
    .reply(200, {
      id: 7505,
      access_token: helper.generateAccessToken({ user_id: testData.user.id }),
      refresh_token: helper.generateRefreshToken({ user_id: testData.user.id }),
      user_id: testData.user.id,
    });
};

/**
 * This function will the HTTP interceptor to the normal unmocked behaviour.
 * Note: this does not clear the interceptor list.
 *
 * @requires nock
 */
const remove = () => {
  const interceptors = [
    {
      path: "/managementservice//\\/api\\/v1\\/users\\/\\d+$/",
      method: "PATCH",
    },
    {
      path: "/managementservice/api/v1/register",
      method: "POST",
    },
    {
      path: "/managementservice/api/v1/security/tokens",
      method: "POST",
    },
  ];
  interceptors.forEach((interceptor) => {
    nock.removeInterceptor({
      hostname: "management-dev-innovationplatform.visa.com",
      proto: "https",
      port: 8444,
      path: interceptor.path,
      method: interceptor.method,
    });
  });
};

module.exports = {
  create,
  remove,
};
