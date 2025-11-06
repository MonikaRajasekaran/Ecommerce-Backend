/**
 * This file is used to mock TES endpoints.
 *
 * Using nock, the TES endpoints are defined here with
 * the expected reply.
 *
 * @author Felicia Amy.
 * @since  17/6/2019
 */
const nock = require("nock");
const config = require("../../../config/config");

/**
 * This function will create all mock endpoints inside the function.
 *
 * @requires nock
 */
const create = () => {
  nock(config.tes_api_url).persist().post("/users").reply(200);
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
      path: "/api/users",
      method: "POST",
    },
  ];
  interceptors.forEach((interceptor) => {
    nock.removeInterceptor({
      hostname: "sl73playdapd012.visa.com",
      proto: "https",
      port: 8443,
      path: interceptor.path,
      method: interceptor.method,
    });
  });
};
module.exports = {
  create,
  remove,
};
