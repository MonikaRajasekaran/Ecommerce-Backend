const chaiHttp = require("chai-http");
const should = require("chai").should();
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised).should();
chai.use(chaiHttp);
exports.chai = chai;
exports.should = should;
exports.assert = chai.assert;
