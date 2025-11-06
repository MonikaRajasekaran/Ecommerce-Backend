const { check } = require("express-validator");

exports.validate = (method) => {
  switch (method) {
    case "getMerchant": {
      return [
        check("type")
          .exists()
          .trim()
          .escape()
          .withMessage("type doesn't exists"),
      ];
    }
    default:
      return [];
  }
};
