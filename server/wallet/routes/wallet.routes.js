/* Third party npm */
const express = require("express");

const router = express.Router();

/* Internal modules */
const walletController = require("../controllers/wallet.controller");
const walletValidator = require("../../middleware/validators/wallet.validator");
const error = require("../../middleware/validators/error.validator");

router
  .route("/:walletId")
  .get(
    walletValidator.validate("getWalletByWalletId"),
    error.check(),
    walletController.getByWalletId
  );

router.route("/").get(walletController.getWallet);

router
  .route("/:walletId/addFunds")
  .patch(
    walletValidator.validate("updateWallet"),
    error.check(),
    walletController.addFund
  );

router
  .route("/:walletId/deductFunds")
  .patch(
    walletValidator.validate("updateWallet"),
    error.check(),
    walletController.deductFunds
  );

// router
//   .route("/me/fund")
//   .patch(
//     walletValidator.validate("updateMyWallet"),
//     error.check(),
//     walletController.addFundtoMyaccount
//   );

module.exports = router;
