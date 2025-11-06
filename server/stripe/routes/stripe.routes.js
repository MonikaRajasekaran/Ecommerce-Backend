/* Third party npm */
const express = require("express");

const router = express.Router();

/* Internal modules */
const controller = require("../controllers/stripe.controller");
// const walletValidator = require("../../middleware/validators/wallet.validator");
// const error = require("../../middleware/validators/error.validator");

router.route("/connected-accounts").get(controller.getConnectedAccounts);

router.route("/onboard").post(controller.onboardStripeAccount);

router.route("/retrieve").post(controller.retreiveStripeAccount);

module.exports = router;
