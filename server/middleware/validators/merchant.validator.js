const { check } = require("express-validator");

exports.validate = (method) => {
  switch (method) {
    case "GetMerchantById": {
      return [
        check("merchantId")
          .exists()
          .trim()
          .escape()
          .withMessage("MerchantID should not be empty"),
      ];
    }
    case "CreateMerchant": {
      return [
        check("merchantName")
          .exists()
          .trim()
          .escape()
          .withMessage("merchantName doesn't exists"),
        check("merchantType")
          .exists()
          .trim()
          .escape()
          .withMessage("merchantType doesn't exists"),
        check("acceptedPayment")
          .exists()
          .trim()
          .escape()
          .withMessage("acceptedPayment doesn't exists"),
        check("geoLocation.lat")
          .exists()
          .isNumeric()
          .trim()
          .escape()
          .withMessage("geoLocation.lat doesn't exists"),
        check("geoLocation.long")
          .exists()
          .isNumeric()
          .trim()
          .escape()
          .withMessage("geoLocation.long doesn't exists"),
        check("logo").exists().trim().withMessage("logo doesn't exists"),
        check("acceptedCurrency")
          .exists()
          .trim()
          .escape()
          .withMessage("acceptedCurrency doesn't exists"),
        check("accountId")
          .exists()
          .trim()
          .escape()
          .withMessage("accountId doesn't exists"),
      ];
    }
    case "PatchMerchant": {
      return [
        check("merchantId")
          .exists()
          .trim()
          .escape()
          .withMessage("MerchantID should not be empty"),
      ];
    }
    case "DeleteMerchant": {
      return [
        check("merchantId")
          .exists()
          .trim()
          .escape()
          .withMessage("MerchantID should not be empty"),
      ];
    }
    default:
      return [];
  }
};
