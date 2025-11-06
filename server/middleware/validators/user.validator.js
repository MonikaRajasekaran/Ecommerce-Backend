const { check } = require("express-validator");
const PasswordValidator = require("password-validator");

const schema = new PasswordValidator();
schema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(20) // Maximum length 20
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits() // Must have digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .has()
  .symbols();

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
        check("password")
          .exists()
          .trim()
          .escape()
          .custom((val) => schema.validate(val))
          .withMessage(
            "Password should not be empty, Minimum eight characters, at least one letter, one number and one special character"
          ),
        check("metaData").optional(),
      ];
    }
    case "ConsumerAuth": {
      return [
        check("username")
          .isLength({ min: 5, max: 22 })
          .exists()
          .trim()
          .escape()
          .withMessage(
            "Username length should be in range between 5 to 22 characters"
          ),
        check("password")
          .exists()
          .trim()
          .escape()
          .withMessage("Password should not be empty"),
      ];
    }
    case "AdminAuth": {
      return [
        check("username")
          .isLength({ min: 5, max: 22 })
          .exists()
          .trim()
          .escape()
          .withMessage(
            "Username length should be in range between 5 to 22 characters"
          ),
        check("hidToken")
          .isLength({ min: 8, max: 8 })
          .isNumeric()
          .trim()
          .escape()
          .withMessage("HID length should be 8 digit integers"),
        check("password")
          .exists()
          .trim()
          .escape()
          .withMessage("Password should not be empty"),
      ];
    }
    case "RefreshToken": {
      return [
        check("accessToken")
          .exists()
          .trim()
          .escape()
          .withMessage("Token should not be empty"),
        check("refreshToken")
          .exists()
          .trim()
          .escape()
          .withMessage("Refresh Token should not be empty"),
      ];
    }
    case "GetByUserID": {
      return [
        check("userId")
          .exists()
          .trim()
          .escape()
          .withMessage("UserID should not be empty"),
      ];
    }
    case "PatchUsers": {
      return [
        check("userId")
          .exists()
          .trim()
          .escape()
          .withMessage("UserID should not be empty"),
      ];
    }
    case "DeleteUsers": {
      return [
        check("userId")
          .exists()
          .trim()
          .escape()
          .withMessage("UserID should not be empty"),
      ];
    }
    default:
      return [];
  }
};
