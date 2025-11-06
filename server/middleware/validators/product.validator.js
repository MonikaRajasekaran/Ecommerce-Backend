const { check } = require("express-validator");
const _ = require("lodash");

exports.validate = (method) => {
  switch (method) {
    case "createProduct": {
      return [
        check("storeId")
          .exists()
          .trim()
          .escape()
          .withMessage("storeId should not be empty"),
        check("title")
          .exists()
          .trim()
          .escape()
          .withMessage("title should not be empty"),
        check("categoryId")
          .exists()
          .trim()
          .escape()
          .withMessage("categoryId should not be empty"),
        check("amount")
          .exists()
          .trim()
          .escape()
          .withMessage("amount should not be empty"),
        check("variants.*.variantTitle")
          .exists()
          .trim()
          .escape()
          .withMessage("variants.*.variantTitle should not be empty"),
        check("variants.*.variantList")
          .custom((item) => _.isArray(item) && item.length > 0)
          .withMessage("variants.*.variantList should not be empty"),
        check("variants.*.variantList.*.title")
          .exists()
          .trim()
          .escape()
          .withMessage("variants.*.variantList*.title should not be empty"),
        check("variants.*.variantList.*.amount")
          .exists()
          .trim()
          .escape()
          .withMessage("variants.*.variantList*.amount should not be empty"),
      ];
    }
    case "getProductbyStoreId": {
      return [
        check("storeId")
          .exists()
          .trim()
          .escape()
          .withMessage("storeId should not be empty"),
      ];
    }
    case "getProductbyId": {
      return [
        check("productId")
          .exists()
          .trim()
          .escape()
          .withMessage("productId should not be empty"),
      ];
    }
    case "deleteProduct": {
      return [
        check("productId")
          .exists()
          .trim()
          .escape()
          .withMessage("productId should not be empty"),
      ];
    }
    case "patchProduct": {
      return [
        check("productId")
          .exists()
          .trim()
          .escape()
          .withMessage("productId should not be empty"),
      ];
    }
    default:
      return [];
  }
};
