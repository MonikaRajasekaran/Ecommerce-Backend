const { check } = require("express-validator");

exports.validate = (method) => {
  switch (method) {
    case "createStore": {
      return [
        check("regionId")
          .exists()
          .trim()
          .escape()
          .withMessage("regionId should not be empty"),
        check("currency.currencyCode")
          .exists()
          .trim()
          .escape()
          .withMessage("currency.currencyCode should not be empty"),
        check("currency.displayAs")
          .exists()
          .trim()
          .escape()
          .withMessage("currency.displayAs should not be empty"),
        check("merchantId")
          .exists()
          .trim()
          .escape()
          .withMessage("merchantId should not be empty"),
        check("storeName")
          .exists()
          .trim()
          .escape()
          .withMessage("storeName should not be empty"),
      ];
    }
    case "getStoresbyMerchantId": {
      return [
        check("merchantId")
          .exists()
          .trim()
          .escape()
          .withMessage("merchantId should not be empty"),
      ];
    }
    case "getStorebyId": {
      return [
        check("storeId")
          .exists()
          .trim()
          .escape()
          .withMessage("storeId should not be empty"),
      ];
    }
    case "deleteStore": {
      return [
        check("storeId")
          .exists()
          .trim()
          .escape()
          .withMessage("storeId should not be empty"),
      ];
    }
    case "patchStore": {
      return [
        check("storeId")
          .exists()
          .trim()
          .escape()
          .withMessage("storeId should not be empty"),
      ];
    }
    default:
      return [];
  }
};
