const { check } = require("express-validator");

exports.validate = (method) => {
  switch (method) {
    case "getWalletByWalletId": {
      return [
        check("walletId")
          .exists()
          .trim()
          .escape()
          .withMessage("walletId should not be empty"),
      ];
    }
    case "updateMyWallet": {
      return [
        check("amount")
          .exists()
          .trim()
          .escape()
          .withMessage("amount should not be empty"),
      ];
    }
    case "updateWallet": {
      return [
        check("walletId")
          .exists()
          .trim()
          .escape()
          .withMessage("walletId should not be empty"),
      ];
    }
    default:
      return [];
  }
};
