const { check, body } = require("express-validator");

exports.validate = (method) => {
  switch (method) {
    case "CreateRegion": {
      return [
        check("regionAsDisplay")
          .exists()
          .trim()
          .escape()
          .withMessage("regionAsDisplay doesn't exists"),
        check("regionCode")
          .exists()
          .trim()
          .escape()
          .withMessage("regionCode doesn't exists"),
        check("currency.currencyCode")
          .exists()
          .trim()
          .escape()
          .withMessage("currency.currencyCode doesn't exists"),
        check("currency.displayAs")
          .exists()
          .trim()
          .escape()
          .withMessage("currency.displayAs doesn't exists"),
      ];
    }
    case "UpdateRegion": {
      return [
        check("currency.currencyCode")
          .if(body("currency").exists())
          .exists()
          .trim()
          .withMessage("currencyCode doesn't exists"),
        check("currency.displayAs")
          .if(body("currency").exists())
          .exists()
          .trim()
          .withMessage("displayAs doesn't exists"),
        check("subscription.subscriptionName")
          .if(body("subscription").exists())
          .exists()
          .trim()
          .withMessage("subscriptionName doesn't exists"),
        check("subscription.logoUrl")
          .if(body("subscription").exists())
          .exists()
          .trim()
          .isURL()
          .withMessage("logoUrl doesn't exists"),
        check("subscription.order")
          .if(body("subscription").exists())
          .exists()
          .trim()
          .isNumeric()
          .withMessage("order doesn't exists"),
        check("linkedAccount.linkedAccountName")
          .if(body("linkedAccount").exists())
          .exists()
          .trim()
          .withMessage("linkedAccountName doesn't exists"),
        check("linkedAccount.logoUrl")
          .if(body("linkedAccount").exists())
          .exists()
          .trim()
          .isURL()
          .withMessage("logoUrl doesn't exists"),
        check("linkedAccount.order")
          .if(body("linkedAccount").exists())
          .exists()
          .trim()
          .isNumeric()
          .withMessage("order doesn't exists"),
        check("bank.bankName")
          .if(body("bank").exists())
          .exists()
          .trim()
          .withMessage("bankName doesn't exists"),
        check("bank.logoUrl")
          .if(body("bank").exists())
          .exists()
          .trim()
          .isURL()
          .withMessage("logoUrl doesn't exists"),
        check("bank.order")
          .if(body("bank").exists())
          .exists()
          .trim()
          .isNumeric()
          .withMessage("order doesn't exists"),
        // Validate Payee Details
        check("payee.payeeName")
          .if(body("payee").exists())
          .exists()
          .trim()
          .withMessage("payeeName doesn't exists"),
        check("payee.profileURL")
          .if(check("payee").exists())
          .exists()
          .exists()
          .trim()
          .isURL()
          .withMessage("profileURL doesn't exists"),
        check("payee.metaData.paymentTo")
          .if(check("payee").exists())
          .exists()
          .exists()
          .trim()
          .withMessage("metaData.paymentTo doesn't exists"),
      ];
    }
    case "UpdateOffers": {
      return [
        check("offers.offerId")
          .exists()
          .trim()
          .withMessage("OfferId doesn't exists"),
        check("offers.backgroundImage")
          .exists()
          .trim()
          .withMessage("backgroundImage doesn't exists"),
        check("offers.title")
          .exists()
          .trim()
          .withMessage("title doesn't exists"),
        check("offers.categoryType")
          .exists()
          .trim()
          .withMessage("categoryType doesn't exists"),
      ];
    }
    default:
      return [];
  }
};
