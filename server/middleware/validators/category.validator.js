const { check } = require("express-validator");

exports.validate = (method) => {
  switch (method) {
    case "createCategory": {
      return [
        check("storeId")
          .exists()
          .trim()
          .escape()
          .withMessage("storeId should not be empty"),
        check("categoryName")
          .exists()
          .trim()
          .escape()
          .withMessage("categoryName should not be empty"),
      ];
    }
    case "getCategorybyStoreId": {
      return [
        check("storeId")
          .exists()
          .trim()
          .escape()
          .withMessage("storeId should not be empty"),
      ];
    }
    case "getCategorybyId": {
      return [
        check("categoryId")
          .exists()
          .trim()
          .escape()
          .withMessage("categoryId should not be empty"),
      ];
    }
    case "deleteCategory": {
      return [
        check("categoryId")
          .exists()
          .trim()
          .escape()
          .withMessage("categoryId should not be empty"),
      ];
    }
    case "patchCategory": {
      return [
        check("categoryId")
          .exists()
          .trim()
          .escape()
          .withMessage("categoryId should not be empty"),
      ];
    }
    default:
      return [];
  }
};
