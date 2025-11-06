module.exports = {
  clients: {
    visa: { name: "VISA", domain: "visa.com", status: "ACTIVE" },
    gmail: { name: "GMAIL", domain: "gmail.com", status: "ACTIVE" },
  },
  email: {
    visa: "someone@visa.com",
    gmail: "someone@gmail.com",
    faulty: "someone@visa",
    hotmail: "someone@hotmail.com",
  },
  encryptedValues: {
    visaEmail: "FaU(1(.@da+gVEB:",
    gmail: '0y]]}%2@U"w#{W#:o',
    firstName: "C/Ht-{I",
    lastName: "mp(=6FOe",
  },
  user: {
    facePay: {
      isEnabled: false,
    },
    isPBKDF2: true,
    role: ["USER"],
    status: "ACTIVE",
    passwordLastReset: "2020-06-08T17:40:49.093Z",
    isVerified: true,
    isActive: true,
    firstName: "SOME",
    username: "SOMEONE",
    password: "Test!123",
    lastName: "ONE",
    regionId: "Rtyuguguu",
    userId: "YgY2wer2k",
    createdAt: "2020-06-08T17:40:50.780Z",
    updatedAt: "2020-06-15T17:57:45.415Z",
  },
  deviceId: "773467",
  otp: { good: "678977", bad: "ab5013" },
  registerId: 263,
  appId: {
    receiptdee: "RECEIPTDEE",
  },
  userStatus: {
    active: "Active",
  },
  onboardingStatus: {
    pending: "Pending",
    completed: "Completed",
  },
  profilePicStatus: { newUpload: "NEWUPLOAD" },
};
