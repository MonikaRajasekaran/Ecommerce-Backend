const { check } = require("express-validator");

exports.validate = (method) => {
  switch (method) {
    case "GetCardByCardId": {
      return [
        check("cardId")
          .exists()
          .trim()
          .escape()
          .withMessage("cardId should not be empty"),
      ];
    }
    case "IssueCard": {
      return [
        check("cardHolderName")
          .exists()
          .trim()
          .escape()
          .withMessage("cardHolderName doesn't exists"),

        check("cardType")
          .exists()
          .trim()
          .escape()
          .custom((value) => {
            if (value === "PRIMARY" || value === "SECONDARY") {
              return true;
            }
            return false;
          })
          .withMessage("Invalid cardType"),

        check("primaryCardId")
          // if cardType is 'SECONDARY', then only check for primaryCardId.
          // Otherwise no need for primaryCardId
          .if((value, { req }) => req.body.cardType === "SECONDARY")
          .exists()
          .trim()
          .escape()
          .withMessage("primaryCardId Missing"),
        check("accountId")
          .exists()
          .trim()
          .escape()
          .withMessage("accountId doesn't exists"),
      ];
    }
    default:
      return [];
  }
};
