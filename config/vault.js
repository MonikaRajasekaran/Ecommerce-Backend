// eslint-disable-next-line import/no-extraneous-dependencies
const request = require("request");
const { vault } = require("./config");

exports.config = async () => {
  const req = await request(vault.url);
  return req;
};
