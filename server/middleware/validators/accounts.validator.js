const { check, body } = require("express-validator");

exports.validate = (method) => {
  switch (method) {
    case "createAccounts": {
      return [
        check("accountType")
          .exists()
          .trim()
          .escape()
          .custom((value) => {
            if (value === "SAVINGS" || value === "CURRENT") {
              return true;
            }
            return false;
          })
          .withMessage("accountType is invalid"),
        check("regionId")
          .exists()
          .trim()
          .escape()
          .withMessage("regionId should not be empty"),
        check("currency.currencyCode")
          .exists()
          .trim()
          .escape()
          .withMessage("currency.currencyCode should not be empty"),
        check("currency.currencyCode")
          .exists()
          .trim()
          .escape()
          .withMessage("currency.currencyCode should not be empty"),
        body("userId")
          .trim()
          .escape()
          .customSanitizer((value, { req }) => {
            if (!value) {
              req.body.userId = req.user.userId;
              return req.body.userId;
            }
            return value;
          }),
      ];
    }
    case "getAccountbyId": {
      return [
        check("accountId")
          .exists()
          .trim()
          .escape()
          .withMessage("accountId should not be empty"),
      ];
    }
    case "deleteAccount": {
      return [
        check("accountId")
          .exists()
          .trim()
          .escape()
          .withMessage("accountId should not be empty"),
      ];
    }
    case "patchAccount": {
      return [
        check("accountId")
          .exists()
          .trim()
          .escape()
          .withMessage("accountId should not be empty"),
        check("availableFunds")
          .exists()
          .trim()
          .escape()
          .custom((value) => {
            if (!Number.isNaN(Number(value)) && value > 0) {
              return true;
            }
            return false;
          })
          .withMessage("availableFunds should be valid"),
      ];
    }
    case "getAccountDetail": {
      return [
        check("accountType")
          .exists()
          .trim()
          .escape()
          .isAlphanumeric()
          .withMessage("accountType should not be empty"),
      ];
    }
    case "initializeUser": {
      return [
        check("userId")
          .exists()
          .trim()
          .escape()
          .withMessage("userId should not be empty"),
        check("regionId")
          .exists()
          .trim()
          .escape()
          .withMessage("regionId should not be empty"),
        check("accountType")
          .exists()
          .trim()
          .escape()
          .isString()
          .custom((value) => {
            if (value === "SAVINGS" || value === "CURRENT") {
              return true;
            }
            return false;
          })
          .withMessage("accountType should not be empty"),
      ];
    }
    case "initializePayee": {
      return [
        check("payeeId")
          .exists()
          .trim()
          .escape()
          .withMessage("payeeId should not be empty"),
        check("regionId")
          .exists()
          .trim()
          .escape()
          .withMessage("regionId should not be empty"),
      ];
    }
    default:
      return [];
  }
};
