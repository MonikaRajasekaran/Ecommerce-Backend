const { check } = require("express-validator");

exports.validate = (method) => {
  switch (method) {
    case "AddRegisterationToken": {
      return [
        check("registrationToken")
          .exists()
          .trim()
          .escape()
          .withMessage("registrationToken doesn't exists"),
      ];
    }
    case "RequestCard": {
      return [
        check("amount")
          .exists()
          .isNumeric()
          .withMessage("Invalid amount format"),
        check("startDate")
          .exists()
          .isNumeric()
          .withMessage("Invalid startDate format"),
        check("endDate")
          .exists()
          .isNumeric()
          .withMessage("Invalid endDate format"),
        check("cardLabel").exists().withMessage("Card label should exist"),
        check("businessSpendCategory")
          .exists()
          .withMessage("businessSpendCategory should exists"),
        check("description").exists().withMessage("description should exist"),
      ];
    }
    default:
      return [];
  }
};
