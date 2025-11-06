const { check } = require("express-validator");
const Constants = require("../../helpers/Constants");

exports.validate = (method) => {
  switch (method) {
    case "CampaignCreate": {
      return [
        check("title")
          .exists()
          .trim()
          .escape()
          .withMessage("title should exists"),

        check("description")
          .exists()
          .trim()
          .escape()
          .withMessage("description should exists"),
        check("requirements")
          .custom(
            (value) => value.default.length > 0 || value.custom.length > 0
          )
          .notEmpty()
          .withMessage("Atleast one requirements has to be assigend"),

        check("pricing.tier")
          .exists()
          .trim()
          .escape()
          .withMessage("pricing.tier should exist"),
        check("platform")
          .exists()
          .trim()
          .escape()
          .withMessage("platform should exist"),
        check("pricing.normal")
          .if((value, { req }) => req.body.pricing.tier === "NORMAL")
          .notEmpty()
          .custom((value) => value.length > 0)
          .withMessage("pricing.normal should exist"),
        check("pricing.elite")
          .if((value, { req }) => req.body.pricing.tier === "ELITE")
          .notEmpty()
          .custom((value) => value.length > 0)
          .withMessage("pricing.elite should exist"),
        check("pricing.normal.*.amountPerView")
          .if((value, { req }) => req.body.pricing.type === "PAY_PER_VIEW")
          .notEmpty()
          .withMessage("pricing.normal.*.amountPerView should exist"),
        check("pricing.normal.*.amountPerClick")
          .if((value, { req }) => req.body.pricing.type === "PAY_PER_CLICK")
          .notEmpty()
          .withMessage("pricing.normal.*.amountPerClick should exist"),
        check("pricing.normal.*.amountPerContent")
          .if((value, { req }) => req.body.pricing.type === "PAY_PER_CONTENT")
          .notEmpty()
          .withMessage("pricing.normal.*.amountPerContent should exist"),
        check("pricing.normal.*.numOfInfluencers")
          .if((value, { req }) => req.body.pricing.tier === "NORMAL")
          .notEmpty()
          .withMessage("pricing.normal.*.numOfInfluencers should exist"),
        check("pricing.normal.*.influencerType")
          .if((value, { req }) => req.body.pricing.tier === "NORMAL")
          .notEmpty()
          .withMessage("pricing.normal.*.influencerType should exist"),
        check("pricing.normal.*.maxAmount")
          .if((value, { req }) => req.body.pricing.tier === "NORMAL")
          .notEmpty()
          .withMessage("pricing.normal.*.maxAmount should exist"),
        check("startDate")
          .exists()
          .trim()
          .escape()
          .withMessage("startDate should exist"),
        check("endDate")
          .exists()
          .trim()
          .escape()
          .withMessage("endDate should exist"),
      ];
    }
    case "ProcessPaymentMerchant": {
      return [
        check("merchantId")
          .exists()
          .trim()
          .escape()
          .withMessage("merchantId should exists"),

        check("amount")
          .exists()
          .trim()
          .escape()
          .withMessage("amount should exist"),

        check("transactionType")
          .exists()
          .trim()
          .escape()
          .custom((value) => {
            if (value === Constants.TRANSACTION_TYPES.ECOMM) {
              return true;
            }
            return false;
          })
          .withMessage("transactionType doesn't exists"),
      ];
    }
    case "ProcessPaymentMerchantFacepay": {
      return [
        check("merchantId")
          .exists()
          .trim()
          .escape()
          .withMessage("merchantId should exists"),

        check("amount")
          .exists()
          .trim()
          .escape()
          .withMessage("amount should exist"),

        check("transactionType")
          .exists()
          .trim()
          .escape()
          .custom((value) => {
            if (value === Constants.TRANSACTION_TYPES.FACEPAY) {
              return true;
            }
            return false;
          })
          .withMessage("transactionType doesn't exists"),
      ];
    }
    case "deletePayments": {
      return [
        check("paymentId")
          .exists()
          .trim()
          .escape()
          .withMessage("category should exists"),
      ];
    }
    default:
      return [];
  }
};
