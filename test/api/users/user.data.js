module.exports = {
  getOtpPayload: {
    good: {
      password: "Test!123",
      username: "dinesh",
    },
    faultyEmail: {
      email: "someone@visa",
      deviceId: "773467",
    },
    nonWLEmail: {
      email: "someone@hotmail.com",
      deviceId: "773467",
    },
  },
  validateOtpPayload: {
    good: {
      email: "someone@visa.com",
      deviceId: "773467",
      otp: "678977",
    },
    badOtp: {
      email: "someone@visa.com",
      deviceId: "773467",
      otp: "ab5013",
    },
    badEmail: {
      email: "someone@visa",
      deviceId: "773467",
      otp: "678977",
    },
  },
  appId: {
    receiptdee: "RECEIPTDEE",
  },
};
