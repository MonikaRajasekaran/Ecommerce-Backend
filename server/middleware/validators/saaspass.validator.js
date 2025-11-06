const { check } = require("express-validator");
// SaasPass Validator
exports.validate = (method) => {
  switch (method) {
    case "CreateUser": {
      return [
        check("firstName")
          .exists()
          .trim()
          .escape()
          .withMessage("firstName doesn't exists"),
        check("lastName")
          .exists()
          .trim()
          .escape()
          .withMessage("lastName doesn't exists"),
        check("username")
          .isLength({ min: 5, max: 22 })
          .trim()
          .escape()
          .withMessage(
            "Username length should be in range between 5 to 22 characters"
          ),
        check("role")
          .not()
          .isEmpty()
          .withMessage("Atleast one role has to be assigend"),
        check("metaData").optional(),
      ];
    }
    case "checkOTP": {
      return [
        check("email")
          .exists()
          .isEmail()
          .escape()
          .withMessage("email doesn't exists"),
        check("otp").exists().trim().escape().withMessage("otp doesn't exists"),
      ];
    }
    default:
      return [];
  }
};
