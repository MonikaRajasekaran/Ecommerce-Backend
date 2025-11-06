const should = require("chai").should();
const userService = require("../../server/users/services/users.service");
const common = require("../util/common");

const { chai } = common;
const { expect } = chai;
const testData = require("../testData");

describe("Validate Generate Token", () => {
  it("Should return true if Generate Token has new Token and Refresh Token", (done) => {
    const validate = userService.generateToken(testData.user);
    validate.should.be.a("object");
    validate.should.have.property("token");
    validate.should.have.property("refreshToken");
    done();
  });
});

describe("Validate Render User with Token", () => {
  it("Should return user with refresh and access token, if there is an user", (done) => {
    const validate = userService.renderToken(testData.user);
    validate.should.be.a("object");
    validate.should.have.property("userId");
    validate.should.have.property("token");
    validate.should.have.property("refreshToken");
    done();
  });

  it("Should return an error if user is null", (done) => {
    const validate = userService.renderToken({});
    validate.should.be.a("object");
    validate.should.have.property("error");
    expect(validate.error).to.equal("No User details found");
    done();
  });
});
