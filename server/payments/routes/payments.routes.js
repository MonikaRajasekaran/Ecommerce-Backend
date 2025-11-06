/* Third party npm */
const express = require("express");

const router = express.Router();

/* Internal modules */
const paymentController = require("../controllers/payments.controller");
const paymentValidator = require("../../middleware/validators/payments.validator");
const error = require("../../middleware/validators/error.validator");

router.route("/payment-session").post(paymentController.createPaymentSession);

router
  .route("/addPayment")
  .post(
    paymentValidator.validate("ProcessPaymentPayee"),
    error.check(),
    paymentController.processPaymentPayee
  );

router.route("/transactions").get(paymentController.transactions);

// Razor Payments
router.route("/razor/customer").post(paymentController.createRazorCustomer);

router.route("/razor/order").post(paymentController.createRazorSession);

router.route("/razor/completion").post(paymentController.completePayment);

router.route("/razor/request").post(paymentController.requestFromWallet);

router.route("/razor/transfer").post(paymentController.transferPayment);


module.exports = router;
