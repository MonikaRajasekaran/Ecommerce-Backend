const { check } = require("express-validator");

exports.validate = (method) => {
  switch (method) {
    case "getResource": {
      return [
        check("resourceId")
          .exists()
          .trim()
          .escape()
          .withMessage("Password should not be empty"),
      ];
    }
    case "createResource": {
      return [
        check("category")
          .exists()
          .trim()
          .escape()
          .withMessage("Category should not be empty"),
      ];
    }
    default:
      return [];
  }
};
