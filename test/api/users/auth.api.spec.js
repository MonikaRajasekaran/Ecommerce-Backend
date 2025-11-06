const common = require("../../util/common");
const userData = require("./user.data");

const { chai } = common;
/**
 * This function will initialize the authentication tests.
 *
 * @requires chai.expect
 * @param {Express} server Express app from the main code (index.js).
 */
const initialize = (server) => {
  describe("Testing Auth API: POST method Calls", () => {
    const url = "/api/v1/users/consumer/auth";
    it("it should give object with user ID", (done) => {
      chai
        .request(server)
        .post(url)
        .send(userData.getOtpPayload.good)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("userId");
          done();
        });
    });
  });
};
module.exports = { initialize };
