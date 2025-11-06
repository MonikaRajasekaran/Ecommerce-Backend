/**
 * This file is used to mock ETS endpoints.
 *
 * Using nock, the ETS endpoints are defined here with
 * the expected reply.
 *
 */
const nock = require("nock");
const config = require("../../../config/config");
const helper = require("../../util/helper");

/**
 * This function will create all mock endpoints inside the function.
 *
 * @requires nock
 */
const create = () => {
  nock(config.ets.baseUrl)
    .persist()
    .post(`/${config.ets.encryptEndpoint}`, (body) => body.data && body.format)
    .reply(200, (uri, reqBody) => ({
      data: helper.simpleEncrypt(reqBody.data, reqBody.format),
    }));

  nock(config.ets.baseUrl)
    .persist()
    .post(`/${config.ets.decryptEndpoint}`, (body) => body.data && body.format)
    .reply(200, (uri, reqBody) => ({
      data: helper.simpleDecrypt(reqBody.data, reqBody.format),
    }));
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
      path: "/vibesimple/rest/v1/protect",
      method: "POST",
    },
    {
      path: "/vibesimple/rest/v1/access",
      method: "POST",
    },
  ];
  interceptors.forEach((interceptor) => {
    nock.removeInterceptor({
      hostname: "ent-qa-voltage.visa.com",
      proto: "https",
      port: 443,
      path: interceptor.path,
      method: interceptor.method,
    });
  });
};

module.exports = {
  create,
  remove,
};
