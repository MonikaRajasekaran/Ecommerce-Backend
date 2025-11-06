const { check } = require("express-validator");
const Constants = require("../../helpers/Constants");

exports.validate = (method) => {
  switch (method) {
    case "ProcessPaymentPayee": {
      return [
        check("payeeId")
          .exists()
          .trim()
          .escape()
          .withMessage("payeeId should exists"),

        check("sourceAmount")
          .exists()
          .trim()
          .escape()
          .withMessage("Invalid sourceAmount"),

        check("destinationAmount")
          .exists()
          .trim()
          .escape()
          .withMessage("destinationAmount should exist"),

        check("transferFee")
          .exists()
          .trim()
          .escape()
          .withMessage("transferFee should exist"),

        check("destinationCurrency")
          .exists()
          .trim()
          .escape()
          .withMessage("destinationCurrency should exist"),

        check("exchangeRate")
          .exists()
          .trim()
          .escape()
          .withMessage("exchangeRate should exist"),

        check("transactionType")
          .exists()
          .trim()
          .escape()
          .custom((value) => {
            if (value === Constants.TRANSACTION_TYPES.OVERSEAS) {
              return true;
            }
            return false;
          })
          .withMessage("transactionType doesn't exists or wrong value"),
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
